import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Always return the full Open Graph image with HTTP 200.
 * Meta's crawler often sends Range and breaks on CDN 206 responses
 * for static files that advertise Accept-Ranges.
 */
export default function handler(req, res) {
  try {
    const filePath = join(__dirname, "assets", "og-image.jpg");
    const buffer = readFileSync(filePath);

    res.statusCode = 200;
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Length", String(buffer.length));
    res.setHeader(
      "Cache-Control",
      "public, max-age=86400, stale-while-revalidate=604800"
    );
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Robots-Tag", "all");
    res.end(buffer);
  } catch {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Open Graph image unavailable");
  }
}
