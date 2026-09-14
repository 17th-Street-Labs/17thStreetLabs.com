import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = join(import.meta.dirname, "..", "dist", "client");
const host = process.argv.includes("--host") ? process.argv[process.argv.indexOf("--host") + 1] : "127.0.0.1";
const port = process.argv.includes("--port") ? Number(process.argv[process.argv.indexOf("--port") + 1]) : 4322;

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
    if (!res.headersSent) res.writeHead(500);
    res.end("Internal server error");
  }
});

server.listen(port, host, () => {
  console.log(`Serving dist/client at http://${host}:${port}`);
});
