// CDP-driven performance harness.
// Runs each profile N times against the static preview server and reports
// medians, so run-to-run jitter does not get mistaken for a regression.
import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const BASE = process.env.PERF_BASE ?? "http://127.0.0.1:4322";
const RUNS = Number(process.env.PERF_RUNS ?? 5);
const PAGES = (process.env.PERF_PAGES ?? "/,/about/,/services/").split(",");

// Network conditions per CDP Network.emulateNetworkConditions.
const NETWORKS = {
  none: { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 },
  "4g": {
    offline: false,
    latency: 70,
    downloadThroughput: (9 * 1024 * 1024) / 8,
    uploadThroughput: (1.5 * 1024 * 1024) / 8,
  },
  "3g": {
    offline: false,
    latency: 300,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  },
};

const PROFILES = [
  { name: "desktop", network: "none", cpu: 1, viewport: { width: 1440, height: 900 }, mobile: false },
  { name: "desktop-4g-2x", network: "4g", cpu: 2, viewport: { width: 1440, height: 900 }, mobile: false },
  { name: "mobile-4g-4x", network: "4g", cpu: 4, viewport: { width: 390, height: 844 }, mobile: true },
  { name: "mobile-3g-4x", network: "3g", cpu: 4, viewport: { width: 390, height: 844 }, mobile: true },
];

const median = (xs) => {
  const s = [...xs].filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
  if (!s.length) return null;
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

async function measureOnce(browser, profile, path) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    isMobile: profile.mobile,
    hasTouch: profile.mobile,
    deviceScaleFactor: profile.mobile ? 3 : 2,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);

  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", NETWORKS[profile.network]);
  if (profile.cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });

  // Observers must be installed before any navigation: LCP, layout-shift and
  // longtask entries are only retained for an observer that is already
  // registered, so reading them after load returns nothing.
  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0, tbt: 0, longtasks: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__perf.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) window.__perf.cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        window.__perf.tbt += Math.max(0, e.duration - 50);
        window.__perf.longtasks++;
      }
    }).observe({ type: "longtask", buffered: true });
  });

  await page.goto(BASE + path, { waitUntil: "load", timeout: 120000 });

  // Let LCP/CLS settle, then read the buffered performance entries.
  await page.waitForTimeout(2500);

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paints = Object.fromEntries(
      performance.getEntriesByType("paint").map((p) => [p.name, p.startTime]),
    );
    // Transfer sizes come from the resource timing buffer, which reports the
    // real compressed bytes on the wire including the document itself.
    const bytes = { total: 0, script: 0, stylesheet: 0, image: 0, font: 0, document: 0 };
    const bucket = (r) => {
      if (r.initiatorType === "script" || /\.m?js(\?|$)/.test(r.name)) return "script";
      if (r.initiatorType === "link" && /\.css(\?|$)/.test(r.name)) return "stylesheet";
      if (/\.(png|jpe?g|webp|avif|gif|svg)(\?|$)/.test(r.name)) return "image";
      if (/\.(woff2?|ttf|otf)(\?|$)/.test(r.name)) return "font";
      if (/\.css(\?|$)/.test(r.name) || r.initiatorType === "css") return "stylesheet";
      return "document";
    };
    for (const r of performance.getEntriesByType("resource")) {
      const size = r.transferSize || r.encodedBodySize || 0;
      bytes.total += size;
      bytes[bucket(r)] += size;
    }
    if (nav) {
      const docSize = nav.transferSize || nav.encodedBodySize || 0;
      bytes.total += docSize;
      bytes.document += docSize;
    }

    return {
      ttfb: nav?.responseStart ?? null,
      domContentLoaded: nav?.domContentLoadedEventEnd ?? null,
      load: nav?.loadEventEnd ?? null,
      fcp: paints["first-contentful-paint"] ?? null,
      fp: paints["first-paint"] ?? null,
      lcp: window.__perf.lcp || null,
      cls: window.__perf.cls,
      tbt: window.__perf.tbt,
      longtasks: window.__perf.longtasks,
      bytes,
    };
  });

  // Measure animation frame rate over 2s of scrolling — the hero shader plus
  // scroll work is where jank actually shows up.
  const fps = await page.evaluate(async () => {
    const start = performance.now();
    let frames = 0;
    let worst = 0;
    let last = start;
    await new Promise((resolve) => {
      const tick = (t) => {
        frames++;
        worst = Math.max(worst, t - last);
        last = t;
        if (t - start >= 2000) return resolve();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    const elapsed = performance.now() - start;
    return { fps: (frames / elapsed) * 1000, worstFrameMs: worst };
  });

  // Scroll jank: drive a scroll and watch for dropped frames.
  const scroll = await page.evaluate(async () => {
    const start = performance.now();
    let frames = 0;
    let worst = 0;
    let last = start;
    const total = document.body.scrollHeight - window.innerHeight;
    return await new Promise((resolve) => {
      const tick = (t) => {
        frames++;
        worst = Math.max(worst, t - last);
        last = t;
        const p = (t - start) / 1500;
        window.scrollTo(0, Math.min(p, 1) * total);
        if (p >= 1) {
          const elapsed = performance.now() - start;
          return resolve({ scrollFps: (frames / elapsed) * 1000, scrollWorstMs: worst });
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  });

  await context.close();
  return { ...metrics, ...fps, ...scroll };
}

async function main() {
  const browser = await chromium.launch({
    args: ["--enable-gpu", "--ignore-gpu-blocklist", "--use-gl=angle"],
  });
  const report = {};

  for (const profile of PROFILES) {
    report[profile.name] = {};
    for (const path of PAGES) {
      const runs = [];
      for (let i = 0; i < RUNS; i++) {
        runs.push(await measureOnce(browser, profile, path));
      }
      const keys = [
        "ttfb", "fcp", "lcp", "domContentLoaded", "load", "cls", "tbt", "longtasks",
        "fps", "worstFrameMs", "scrollFps", "scrollWorstMs",
      ];
      const agg = Object.fromEntries(keys.map((k) => [k, median(runs.map((r) => r[k]))]));
      agg.bytes = runs[runs.length - 1].bytes;
      report[profile.name][path] = agg;
    }
  }

  await browser.close();

  const out = process.env.PERF_OUT ?? "perf-report.json";
  await writeFile(out, JSON.stringify(report, null, 2));

  // Human-readable summary.
  for (const [profileName, pages] of Object.entries(report)) {
    console.log(`\n### ${profileName}`);
    for (const [path, m] of Object.entries(pages)) {
      const f = (v, d = 0) => (v == null ? "  n/a" : v.toFixed(d).padStart(6));
      console.log(
        `  ${path.padEnd(12)} ttfb=${f(m.ttfb)} fcp=${f(m.fcp)} lcp=${f(m.lcp)} ` +
          `load=${f(m.load)} tbt=${f(m.tbt)} cls=${f(m.cls, 3)} ` +
          `fps=${f(m.fps, 1)} worst=${f(m.worstFrameMs, 1)} ` +
          `sfps=${f(m.scrollFps, 1)} sworst=${f(m.scrollWorstMs, 1)} ` +
          `js=${(m.bytes.script / 1024).toFixed(0)}KB img=${(m.bytes.image / 1024).toFixed(0)}KB ` +
          `total=${(m.bytes.total / 1024).toFixed(0)}KB`,
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
