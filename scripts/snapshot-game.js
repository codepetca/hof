#!/usr/bin/env node
/**
 * Capture a screenshot of a game page.
 *
 * Usage: pnpm snapshot <slug> [url]
 * - Assumes the Next app is running locally (e.g. pnpm dev).
 * - Defaults to http://localhost:3000/play/<slug>
 * - Saves to public/games/<slug>/snapshot.png
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const slug = process.argv[2];
const targetUrl = process.argv[3] || (slug ? `http://localhost:3000/play/${slug}` : null);

if (!slug || !targetUrl) {
  console.error("Usage: pnpm snapshot <slug> [url]");
  process.exit(1);
}

const outPath = path.join(__dirname, "..", "public", "games", slug, "snapshot.png");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(targetUrl, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000); // allow any assets/iframe to settle

  await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, fullPage: true });

  await browser.close();
  console.log(`Saved screenshot -> ${outPath}`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
