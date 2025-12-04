#!/usr/bin/env node
/**
 * Drop CodeHS exports (zip or folder) into ./incoming or pass a path,
 * then run: pnpm ingest [optional-paths]
 * The script copies files to public/games/<slug> and appends metadata to data/games.json.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline/promises");
const { stdin, stdout } = require("process");

const root = path.resolve(__dirname, "..");
const incomingDefault = path.join(root, "incoming");
const publicGamesDir = path.join(root, "public", "games");
const gamesJsonPath = path.join(root, "data", "games.json");
const placeholderSnapshot = "/games/_placeholder.svg";

const rl = readline.createInterface({ input: stdin, output: stdout });

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ask(question, fallback = "") {
  const suffix = fallback ? ` (${fallback})` : "";
  return rl.question(`${question}${suffix}: `).then((ans) => (ans.trim() ? ans.trim() : fallback));
}

function askOptional(question, fallback = "") {
  const suffix = fallback ? ` (${fallback})` : "";
  return rl.question(`${question}${suffix}: `).then((ans) => ans.trim());
}

function askTerm() {
  return rl
    .question("Term (winter/spring, enter to skip): ")
    .then((ans) => {
      const val = ans.trim().toLowerCase();
      if (val === "w" || val === "win" || val === "winter") return "winter";
      if (val === "s" || val === "spr" || val === "spring") return "spring";
      return undefined;
    });
}

function uniqueSlug(base, existing) {
  let candidate = base || "game";
  let n = 2;
  while (existing.has(candidate)) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  fs.cpSync(src, dest, { recursive: true, force: true });
}

function unzipInto(srcZip, dest) {
  ensureDir(dest);
  execSync(`unzip -o ${JSON.stringify(srcZip)} -d ${JSON.stringify(dest)}`, { stdio: "inherit" });
}

function flattenIfNested(dest) {
  const entries = fs.readdirSync(dest).filter((entry) => entry !== "__MACOSX");
  const hasIndex = fs.existsSync(path.join(dest, "index.html"));
  if (hasIndex || entries.length !== 1) return;
  const innerDir = path.join(dest, entries[0]);
  if (fs.statSync(innerDir).isDirectory()) {
    fs.cpSync(innerDir, dest, { recursive: true, force: true });
    fs.rmSync(innerDir, { recursive: true, force: true });
  }
}

function findSnapshotFile(dir) {
  const preferred = ["snapshot.png", "snapshot.jpg", "snapshot.jpeg", "cover.png", "cover.jpg", "cover.jpeg"];
  const files = fs.readdirSync(dir);
  const match = files.find((name) => preferred.includes(name.toLowerCase()));
  return match || null;
}

function loadGames() {
  return JSON.parse(fs.readFileSync(gamesJsonPath, "utf-8"));
}

function saveGames(games) {
  fs.writeFileSync(gamesJsonPath, `${JSON.stringify(games, null, 2)}\n`);
}

function ensureSetSize(content) {
  if (/setSize\s*\(/.test(content)) {
    return content;
  }
  return `setSize(400, 480);\n${content}`;
}

function escapeForSvg(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createTitlePlaceholder(destDir, slug, title, year) {
  const safeTitle = escapeForSvg(title || "Student Game");
  const safeSubtitle = year ? `${year}` : "GameJam Hall of Fame";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-label="${safeTitle}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#111827"/>
      <stop offset="100%" stop-color="#0b1224"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect x="30" y="30" width="740" height="540" rx="28" ry="28" fill="#0b132a" stroke="#1f2937" stroke-width="3"/>
  <rect x="48" y="48" width="704" height="504" rx="22" ry="22" fill="#0f172a" stroke="#1f2937" stroke-width="2"/>
  <path d="M70 140 H730" stroke="#1e293b" stroke-width="2" stroke-dasharray="6 10" opacity="0.6"/>
  <path d="M70 460 H730" stroke="#1e293b" stroke-width="2" stroke-dasharray="6 10" opacity="0.6"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#e2e8f0" font-family="Space Grotesk, 'Inter', system-ui, sans-serif" font-size="40" font-weight="700" letter-spacing="0.5">${safeTitle}</text>
  <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="#94a3b8" font-family="Space Grotesk, 'Inter', system-ui, sans-serif" font-size="18" letter-spacing="1">${escapeForSvg(
    safeSubtitle
  )}</text>
  <circle cx="180" cy="300" r="54" fill="none" stroke="url(#accent)" stroke-width="5" opacity="0.8"/>
  <circle cx="400" cy="240" r="34" fill="none" stroke="#22d3ee" stroke-width="4" opacity="0.7"/>
  <circle cx="560" cy="360" r="42" fill="none" stroke="#a855f7" stroke-width="4" opacity="0.7"/>
</svg>`;

  const outPath = path.join(destDir, "snapshot.svg");
  fs.writeFileSync(outPath, svg, "utf8");
  console.log(`🖼️  Created title placeholder for ${slug}`);
  return true;
}

async function captureSnapshot(destDir, slug, title) {
  let chromium;
  try {
    // Lazy load so ingest still works if Playwright isn't installed
    ({ chromium } = require("playwright"));
  } catch (err) {
    console.warn("⚠️  Playwright not available; skipping auto-snapshot.");
    return false;
  }

  const outPath = path.join(destDir, "snapshot.png");
  const fileUrl = `file://${path.join(destDir, "index.html")}`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  try {
    await page.goto(fileUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`📸 Captured snapshot for ${slug} (${title})`);
    return true;
  } catch (err) {
    console.warn(`⚠️  Snapshot capture failed for ${slug}: ${err.message}`);
    return false;
  } finally {
    await browser.close();
  }
}

function makeHtmlShell(title) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #000;
        font-family: "Space Grotesk", system-ui, sans-serif;
        overflow: hidden;
      }
      #game { width: 100%; height: 100%; }
      canvas { width: 100%; height: 100%; display: block; background: #000; }
    </style>
  </head>
  <body>
    <div id="game">
      <canvas id="canvas" width="400" height="480"></canvas>
    </div>
    <script src="https://unpkg.com/chs-js-lib@latest/dist/chs.iife.js" type="text/javascript"></script>
    <script src="game.js" type="text/javascript"></script>
  </body>
</html>
`;
}

async function processEntry(srcPath, { shouldDelete = false } = {}) {
  const stats = fs.statSync(srcPath);
  const isZip = srcPath.toLowerCase().endsWith(".zip");
  const isDir = stats.isDirectory();
  const isJs = stats.isFile() && srcPath.toLowerCase().endsWith(".js");
  const baseName = path.basename(srcPath).replace(/\.(zip|js)$/i, "");
  const defaultTitle = baseName.replace(/[-_]+/g, " ").replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const title = await ask("Title", defaultTitle);
  const yearInput = await ask("Year", new Date().getFullYear().toString());
  const year = parseInt(yearInput, 10) || new Date().getFullYear();
  const term = await askTerm();

  const games = loadGames();
  const existingSlugs = new Set(games.map((g) => g.slug));
  const slugBase = slugify(`${year}-${title}`) || slugify(baseName) || "game";
  const slug = uniqueSlug(slugBase, existingSlugs);

  const destDir = path.join(publicGamesDir, slug);
  if (fs.existsSync(destDir)) {
    console.error(`❌ public/games/${slug} already exists. Skipping.`);
    return false;
  }

  console.log(`\n➡️  Importing ${srcPath} -> /public/games/${slug}`);
  if (isZip) {
    try {
      unzipInto(srcPath, destDir);
    } catch (err) {
      console.error("❌ unzip failed. Ensure the `unzip` CLI is available.", err.message);
      return false;
    }
  } else if (isDir) {
    copyDir(srcPath, destDir);
  } else if (isJs) {
    ensureDir(destDir);
    const raw = fs.readFileSync(srcPath, "utf8");
    const withSetSize = ensureSetSize(raw);
    fs.writeFileSync(path.join(destDir, "game.js"), withSetSize, "utf8");
    fs.writeFileSync(path.join(destDir, "index.html"), makeHtmlShell(title));
  } else {
    console.warn(`Skipping unsupported file: ${srcPath}`);
    return false;
  }

  if (!isJs) {
    flattenIfNested(destDir);
  }

  const indexPath = path.join(destDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error(`❌ No index.html found in ${destDir}. Skipping.`);
    fs.rmSync(destDir, { recursive: true, force: true });
    return false;
  }

  const snapshot = placeholderSnapshot;

  const gamesList = loadGames();
  const combinedTags = term ? [term] : [];

  gamesList.push({
    slug,
    title,
    year,
    teamName: "Unknown team",
    description: "Student CodeHS JS Graphics game.",
    snapshot,
    gameUrl: `/games/${slug}/index.html`,
    ...(combinedTags.length ? { tags: combinedTags } : {})
  });

  gamesList.sort((a, b) => (b.year === a.year ? a.title.localeCompare(b.title) : b.year - a.year));
  saveGames(gamesList);

  console.log(`✅ Added "${title}" (${year}) at /play/${slug}`);
  if (shouldDelete && fs.existsSync(srcPath)) {
    fs.rmSync(srcPath, { recursive: true, force: true });
    console.log(`🧹 Removed source from ${srcPath}`);
  }
  return true;
}

async function main() {
  ensureDir(incomingDefault);
  const targetsFromArgs = process.argv.slice(2).map((p) => path.resolve(root, p));
  const targets =
    targetsFromArgs.length > 0
      ? targetsFromArgs
      : fs.existsSync(incomingDefault)
        ? fs
            .readdirSync(incomingDefault)
            .filter((name) => !name.startsWith("."))
            .map((name) => path.join(incomingDefault, name))
        : [];

  if (!targets.length) {
    console.log("No files to ingest. Drop zips/folders into ./incoming or pass paths: pnpm ingest path/to/export.zip");
    process.exit(0);
  }

  ensureDir(publicGamesDir);

  for (const target of targets) {
    const stats = fs.existsSync(target) ? fs.statSync(target) : null;
    if (!stats) {
      console.warn(`Skipping missing path: ${target}`);
      continue;
    }
    if (stats.isDirectory() || target.toLowerCase().endsWith(".zip") || target.toLowerCase().endsWith(".js")) {
      const shouldDelete = target.startsWith(incomingDefault);
      // eslint-disable-next-line no-await-in-loop
      await processEntry(target, { shouldDelete });
    } else {
      console.warn(`Skipping unsupported file: ${target}`);
    }
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
