import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(import.meta.dirname, "..", "dist", "client");
const host = process.argv.includes("--host") ? process.argv[process.argv.indexOf("--host") + 1] : "127.0.0.1";
const port = process.argv.includes("--port") ? Number(process.argv[process.argv.indexOf("--port") + 1]) : 4322;

// An explicit deployed signup origin lets the local preview use the existing
// Telegram integration without downloading production secrets.
const signupOrigin = process.argv.includes('--signup-origin')
  ? new URL(process.argv[process.argv.indexOf('--signup-origin') + 1]).origin
  : null;
if (signupOrigin && !signupOrigin.startsWith('https://')) throw new Error('The deployed signup origin must use HTTPS.');

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

async function resolvePath(urlPath) {
  const safePath = normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const candidates = [
    join(root, safePath),
    join(root, safePath, "index.html"),
    join(root, `${safePath}.html`),
  ];
  for (const candidate of candidates) {
    try {
      const s = await stat(candidate);
      if (s.isFile()) return candidate;
    } catch {
      // try next candidate
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (urlPath.startsWith('/api/')) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const isSignup = urlPath.replace(/\/$/, '') === '/api/lab-access';
      const target = new URL(req.url, isSignup && signupOrigin ? signupOrigin : 'http://127.0.0.1:4350');
      const headers = { ...req.headers };
      delete headers.host;
      // The backend compares Origin to its request URL.
      if (headers.origin === `http://${req.headers.host}`) headers.origin = target.origin;
      delete headers['accept-encoding'];
      const upstream = await fetch(target, { method: req.method, headers,
        body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks), signal: AbortSignal.timeout(15000) });
      const responseHeaders = Object.fromEntries(upstream.headers);
      delete responseHeaders['content-encoding'];
      delete responseHeaders['content-length'];
      res.writeHead(upstream.status, responseHeaders);
      res.end(Buffer.from(await upstream.arrayBuffer()));
      return;
    }
    const matchedPath = await resolvePath(urlPath);
    const filePath = matchedPath ?? (await resolvePath("/404"));
    if (!filePath) {
      res.writeHead(404).end("Not found");
      return;
    }
    const body = await readFile(filePath);
    res.writeHead(matchedPath ? 200 : 404, {
      "Content-Type": types[extname(filePath)] ?? "application/octet-stream",
    });
    res.end(body);
  } catch (error) {
    console.error("preview-static request error:", error);
    if (!res.headersSent) res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ error: 'Signup is unavailable right now. Please try again in a moment.' }));
  }
});

// Astro serves the private endpoints; this preview keeps serving the built pages.
let backend;
const backendReady = async () => {
  try {
    const response = await fetch('http://127.0.0.1:4350/api/lab-access/', { signal: AbortSignal.timeout(1000) });
    return response.ok && response.headers.get('content-type')?.includes('application/json');
  } catch { return false; }
};
if (!(await backendReady())) {
  backend = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'dev', '--host', '127.0.0.1', '--port', '4350'], { cwd: join(import.meta.dirname, '..'), stdio: 'inherit' });
  let launchError;
  backend.on('error', error => { launchError = error; });
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (launchError || backend.exitCode !== null) break;
    if (await backendReady()) { ready = true; break; }
    await delay(250);
  }
  if (!ready) {
    backend.kill();
    throw new Error('Could not start the local signup backend.');
  }
}
process.on('exit', () => backend?.kill());
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  backend?.kill();
  server.close();
  process.exit(0);
});
server.listen(port, host, () => {
  console.log(`Serving dist/client at http://${host}:${port}`);
});
