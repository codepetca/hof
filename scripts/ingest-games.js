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

function makeHtmlShell(title) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        padding: 24px;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.15), transparent 35%),
          radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.15), transparent 35%),
          #050816;
        font-family: "Space Grotesk", system-ui, sans-serif;
        color: #e5e7eb;
      }
      .frame {
        width: min(960px, 100%);
        border-radius: 18px;
        padding: 18px;
        background: rgba(8, 15, 35, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.06);
        box-shadow: 0 20px 80px rgba(0, 0, 0, 0.55);
      }
      h1 { margin: 0 0 6px; font-size: 24px; }
      p { margin: 0 0 12px; color: #cbd5e1; }
      canvas {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 16px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.4);
      }
    </style>
  </head>
  <body>
    <div class="frame">
      <h1>${title}</h1>
      <p>Use the controls shown in-game.</p>
      <div id="game"></div>
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
  const termInput = await askOptional("Term (fall/spring)", "");
  const term = termInput ? termInput.toLowerCase() : undefined;

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
    fs.copyFileSync(srcPath, path.join(destDir, "game.js"));
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

  const snapshotFile = findSnapshotFile(destDir);
  const snapshot = snapshotFile ? `/games/${slug}/${snapshotFile}` : placeholderSnapshot;
  if (!snapshotFile) {
    console.warn("⚠️  No snapshot found; using shared placeholder.");
  }

  const teamName = await ask("Team name", "Unknown team");
  const description = await ask("Short description", "");
  const tagsInput = await ask("Tags (comma separated)", "");
  const tags = tagsInput
    ? tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const gamesList = loadGames();

  gamesList.push({
    slug,
    title,
    teamName,
    year,
    description: description || "Student CodeHS JS Graphics game.",
    snapshot,
    gameUrl: `/games/${slug}/index.html`,
    ...(term ? { tags: [term, ...(tags || [])] } : {}),
    ...(tags.length ? { tags } : {})
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
