// Local preview server (not part of the site). Run: node serve.mjs
// Unlike `python -m http.server`, it answers Range requests, which a browser
// needs to scrub or seek inside a video. Real hosts already do this.
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname);
const port = Number(process.argv[2]) || 4173;
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".mp4": "video/mp4",
};

createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = join(root, normalize(path));
  let size;
  try {
    if (!file.startsWith(root + sep)) throw new Error("outside the site folder");
    const stat = statSync(file);
    if (!stat.isFile()) throw new Error("not a file");
    size = stat.size;
  } catch {
    return res.writeHead(404).end("Not found");
  }

  const head = {
    "Content-Type": types[extname(file).toLowerCase()] || "application/octet-stream",
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-cache", // always show the latest edit while previewing
  };
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
  if (!range || (!range[1] && !range[2])) {
    res.writeHead(200, { ...head, "Content-Length": size });
    return req.method === "HEAD" ? res.end() : createReadStream(file).pipe(res);
  }
  // "a-b", "a-" (from a to the end) or "-n" (the last n bytes)
  const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
  const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
  if (start > end) return res.writeHead(416, { "Content-Range": `bytes */${size}` }).end();
  res.writeHead(206, { ...head, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
  req.method === "HEAD" ? res.end() : createReadStream(file, { start, end }).pipe(res);
}).listen(port, "127.0.0.1", () => console.log(`Preview at http://localhost:${port}`));
