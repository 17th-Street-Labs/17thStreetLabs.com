import { allLabEntries, labEntries } from "../src/data/lab.ts";
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

// The Vercel adapter emits prerendered pages under dist/client.
const output = fileURLToPath(new URL("../dist/client/", import.meta.url));
const origin = "https://17thstreetlabs.com";
const navigationRoutes = [
  { route: "/blog", heading: /Blog/, content: /Experiments. Tradeoffs. Things that work./ },
  { route: "/", heading: /Send us.*the hard one\./, content: /The work makes the case\./ },
  { route: "/services", heading: /Serious engineering\..*A little imagination helps\./, content: /How we work/ },
  { route: "/proof", heading: /Trusted by people.*who set the standard\./, content: /ExploitHunter/ },
  { route: "/about", heading: /We don(?:&#39;|')t sell AI theater\./, content: /Marina Levy/ },
];

const articleFiles = (await readdir(new URL("../src/content/lab/", import.meta.url))).filter(name => name.endsWith(".md"));
const articleRoutes = labEntries.map(entry => ({
  route: `/blog/${entry.slug}`,
  heading: /\S/,
  content: /Marina Levy and Dan Levy/,
}));
const routes = [...navigationRoutes, ...articleRoutes];

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))?.slice(1).find((value) => value !== undefined);
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([tag]) => tag);
}

function normalizeRoute(url) {
  return url.pathname.replace(/\/$/, "") || "/";
}

async function readPage(route) {
  return readFile(path.join(output, route, "index.html"), "utf8");
}

for (const { route, heading, content } of routes) {
  test(`${route} ships its content and navigation in static HTML`, async () => {
    const html = await readPage(route);
    assert.match(html, /<!doctype html>/i);
    assert.equal(tags(html, "main").length, 1, "one main landmark");
    assert.equal(tags(html, "h1").length, 1, "one primary heading");
    assert.match(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "", heading);
    assert.match(html, content);
    assert.doesNotMatch(html, /codex-preview|vinext|__next_f/i, "production HTML has no legacy preview/runtime metadata");

    const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
    assert.ok(nav, "navigation is server-rendered");
    const destinations = tags(nav, "a").map((tag) => attribute(tag, "href")).filter(Boolean).map((href) => new URL(href, origin));
    for (const expected of navigationRoutes) {
      assert.ok(destinations.some((url) => url.origin === origin && normalizeRoute(url) === expected.route), `navigation links to ${expected.route}`);
    }
  });

  test(`${route} has production SEO metadata`, async () => {
    const html = await readPage(route);
    const canonical = tags(html, "link").find((tag) => attribute(tag, "rel") === "canonical");
    assert.ok(canonical, "canonical link is present");
    const canonicalUrl = new URL(attribute(canonical, "href"));
    assert.equal(canonicalUrl.origin, origin);
    assert.equal(normalizeRoute(canonicalUrl), route);
    assert.equal(canonicalUrl.search, "");
    assert.equal(canonicalUrl.hash, "");
    const description = tags(html, "meta").find((tag) => attribute(tag, "name") === "description");
    assert.ok(attribute(description ?? "", "content")?.trim(), "description is nonempty");
  });

  test(`${route} references existing local assets and pages`, async () => {
    const html = await readPage(route);
    const references = [
      ...tags(html, "script").map((tag) => attribute(tag, "src")),
      ...tags(html, "img").map((tag) => attribute(tag, "src")),
      ...tags(html, "link").filter((tag) => /^(stylesheet|icon|preload|modulepreload)$/.test(attribute(tag, "rel") ?? "")).map((tag) => attribute(tag, "href")),
      ...tags(html, "a").map((tag) => attribute(tag, "href")),
    ].filter(Boolean);
    for (const reference of references) {
      const url = new URL(reference, `${origin}${route === "/" ? "/" : `${route}/`}`);
      if (url.origin !== origin) continue;
      const pathname = decodeURIComponent(url.pathname);
      const filename = path.extname(pathname) ? pathname : path.join(pathname, "index.html");
      await assert.doesNotReject(access(path.join(output, filename)), `${reference} resolves in the static output`);
    }
  });
}

test("each route has a distinct descriptive title", async () => {
  const titles = await Promise.all(routes.map(async ({ route }) => {
    const html = await readPage(route);
    const title = html.match(/<title\b[^>]*>([^<]+)<\/title>/i)?.[1];
    assert.ok(title?.includes("17th Street Labs"), `${route} title identifies the site`);
    return title;
  }));
  assert.equal(new Set(titles).size, routes.length);
});

test("sitemap and robots expose all public pages and exclude the error page", async () => {
  const index = await readFile(path.join(output, "sitemap-index.xml"), "utf8");
  assert.match(index, /<loc>https:\/\/17thstreetlabs\.com\/sitemap-0\.xml<\/loc>/);
  const sitemap = await readFile(path.join(output, "sitemap-0.xml"), "utf8");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, value]) => new URL(value));
  assert.deepEqual(locations.map(normalizeRoute).sort(), routes.map(({ route }) => route).sort());
  assert.ok(locations.every((url) => url.origin === origin));
  assert.doesNotMatch(sitemap, /\/404\/?</);
  const robots = await readFile(path.join(output, "robots.txt"), "utf8");
  assert.match(robots, /^Sitemap:\s*https:\/\/17thstreetlabs\.com\/sitemap-index\.xml\s*$/im);
});

test("the static error page is branded, excluded from indexing, and links home", async () => {
  const html = await readFile(path.join(output, "404.html"), "utf8");
  assert.match(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "), /This page is off the map\./);
  assert.match(html, /17th Street Labs/);
  const robots = tags(html, "meta").find((tag) => attribute(tag, "name") === "robots");
  assert.match(attribute(robots ?? "", "content") ?? "", /\bnoindex\b/);
  assert.ok(tags(html, "a").some((tag) => attribute(tag, "href") === "/"));
});

test("old contact links redirect to the homepage conversation dialog", async () => {
  const html = await readPage("/contact");
  assert.match(html, /http-equiv="refresh"/i);
  assert.match(html, /url=\/\?contact/);
});

test("old lab links redirect permanently to the blog", async () => {
  const index = await readPage("/lab");
  assert.match(index, /http-equiv="refresh"/i);
  assert.match(index, /url=\/blog\//);
  for (const entry of labEntries) {
    const html = await readPage(`/lab/${entry.slug}`);
    assert.match(html, /http-equiv="refresh"/i);
    assert.ok(html.includes(entry.url));
  }
});

test("published articles are complete, undated, and discoverable from the blog", async () => {
  assert.equal(articleRoutes.length, 9);
  assert.equal(articleFiles.length, 10);
  const index = await readPage("/blog");
  assert.doesNotMatch(index, /Coming soon/);
  for (const { route } of articleRoutes) {
    assert.ok(tags(index, "a").some(tag => attribute(tag, "href") === `${route}/`), `${route} appears in index`);
    const html = await readPage(route);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
    assert.match(main, /The takeaway/);
    assert.match(main, /Keep reading/);
    assert.doesNotMatch(main, /<time\b|datePublished|dateModified|Coming soon/i);
    assert.ok(tags(main, "h2").length >= 3, `${route} renders complete article sections`);
    assert.match(main, /data-lab-article/);
    assert.doesNotMatch(main, /data-protected-article|data-lab-gate/);
    const structured = [...main.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
    assert.ok(structured.some(item => item['@type'] === 'BlogPosting' && item.isAccessibleForFree === true));
  }
});


test("draft content is retained but excluded from routes, links, and sitemap", async () => {
  const drafts = allLabEntries.filter(entry => entry.draft);
  assert.ok(drafts.some(entry => entry.slug === 'lessons-from-ai-security-agents'));
  const sitemap = await readFile(path.join(output, 'sitemap-0.xml'), 'utf8');
  for (const draft of drafts) {
    const source = await readFile(new URL(`../src/content/lab/${draft.slug}.md`, import.meta.url), 'utf8');
    assert.match(source, /The bill was also a research budget/);
    await assert.rejects(access(path.join(output, 'blog', draft.slug, 'index.html')), { code: 'ENOENT' });
    await assert.rejects(access(path.join(output, 'lab', draft.slug, 'index.html')), { code: 'ENOENT' });
    assert.ok(!sitemap.includes(draft.url));
    for (const { route } of routes) {
      const html = await readPage(route);
      assert.ok(!html.includes(draft.url), `${route} must not link to drafts`);
      assert.ok(!html.includes(draft.title), `${route} must not expose draft titles`);
    }
  }
});
