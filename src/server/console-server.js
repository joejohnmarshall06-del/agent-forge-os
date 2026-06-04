import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";

export async function createConsoleServer({ port = 4222 } = {}) {
  const root = resolve(process.cwd(), "web");
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    const path = url.pathname === "/" ? "/index.html" : url.pathname;

    if (path === "/api/health") {
      sendJson(res, { ok: true, name: "Agent Forge OS" });
      return;
    }

    try {
      const filePath = safeStaticPath(root, path);
      if (!filePath) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      const file = await readFile(filePath);
      res.writeHead(200, { "content-type": contentType(path) });
      res.end(file);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  await new Promise((resolve) => server.listen(port, resolve));
  return { server, port };
}

export function safeStaticPath(root, requestPath) {
  const decoded = decodeURIComponent(requestPath);
  const segments = decoded.split(/[\\/]+/);
  if (segments.includes("..")) {
    return null;
  }
  const normalized = normalize(decoded).replace(/^([/\\])+/, "");
  const candidate = resolve(root, normalized);
  return candidate === root || candidate.startsWith(`${root}${sep}`) ? candidate : null;
}

function sendJson(res, body) {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function contentType(path) {
  const ext = extname(path);
  if (ext === ".css") return "text/css";
  if (ext === ".js") return "text/javascript";
  return "text/html";
}
