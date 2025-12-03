# 📘 GameJam Hall of Fame Website — Build Specification (Next.js + Vercel)

This document is a **one-shot prompt** you can give to Claude/Codex/ChatGPT to generate an entire working **Next.js** website that hosts your **Grade 10 GameJam Hall of Fame**.

Copy–paste *this entire file* into an AI model to have it generate the full project.

---

## 🎯 Project Goal

Build a small, production-ready **Next.js website** (TypeScript, App Router) that deploys to **Vercel** and hosts a **Hall of Fame** of student-built CodeHS JavaScript Graphics games.

Each game is exported from the CodeHS Sandbox as a downloaded `.js` file. AI should generate a clean, static site where the games run inside `<iframe>` windows.

---

# 🧠 Full Prompt for AI

> **AI: You are an expert full-stack engineer. Build me a complete Next.js project following the specification below.**

---

## 🚀 Project Requirements

### Framework
- **Next.js** (latest stable)
- **App Router** (`app/` directory)
- **TypeScript everywhere**
- **TailwindCSS** (optional but preferred)
- Zero backend — ONLY static files
- Production target: **Vercel**

---

## 🕹️ Game Structure

Each student’s game is stored as:

```
public/games/<slug>/
  index.html     (wrapper + CodeHS graphics library)
  game.js        (student's downloaded Sandbox file)
  snapshot.png   (first screen snapshot)
```

`index.html` includes:

```html
<script src="https://unpkg.com/chs-js-lib@latest/dist/chs.iife.js"
        type="text/javascript"></script>
<script src="game.js" type="text/javascript"></script>
```

---

## 📁 Data Model

Create `lib/games.ts` exporting:

```ts
export type Game = {
  slug: string;
  title: string;
  teamName: string;
  year: number;
  description: string;
  snapshot: string;
  gameUrl: string;
  tags?: string[];
};

export const games: Game[] = [
  {
    slug: "space-dodger",
    title: "Space Dodger",
    teamName: "Team Rocket",
    year: 2025,
    description: "A fast-paced dodging game built in CodeHS JS Graphics.",
    snapshot: "/games/space-dodger/snapshot.png",
    gameUrl: "/games/space-dodger/index.html",
    tags: ["2025", "winner"]
  }
];
```

---

## 🗂️ Pages / Routes

### 1️⃣ `/` — Hall of Fame (Home)
- Hero section:
  - “GameJam Hall of Fame”
  - Subtitle: “Grade 10 Computer Science – Student-Created Games”
- Responsive grid of game cards:
  - snapshot image
  - title
  - team name & year
  - tags
  - “Play” button → `/play/<slug>`
- Add optional filtering:
  - e.g., **filter by year**
  - implemented client-side with React state

### 2️⃣ `/play/[slug]`
- Dynamic route
- Load the matching game from `games`
- Display:
  - title
  - team name
  - year
  - description
  - `<iframe>` container

Example:

```tsx
<iframe
  src={game.gameUrl}
  width={800}
  height={600}
  className="rounded-xl border"
  title={game.title}
/>
```

The game runs fully inside the iframe via its own HTML/JS.

---

## 🧱 App Directory Structure

```
app/
  page.tsx               // home
  layout.tsx             // site-wide layout
  play/
    [slug]/
      page.tsx           // iframe game player
lib/
  games.ts               // game metadata
public/
  games/
    (slug folders here)
styles/
  globals.css
tailwind.config.js
tsconfig.json
package.json
README.md
```

---

## 🧩 Layout Requirements

### `layout.tsx`
- Minimal header
- Footer with “© GameJam Hall of Fame”
- Loaded with Tailwind styling

### `page.tsx` (Home)
- Server component except:
  - If filtering/sorting UI is added, wrap only the grid as a Client Component

### `play/[slug]/page.tsx`
- Validate slug
- If game missing → render 404-ish message
- Otherwise load game metadata + iframe

---

## 📚 README.md Requirements

AI should generate a README that includes:

### How to add a new game
1. Create folder: `public/games/<slug>/`
2. Add:
   - `index.html`
   - `game.js`
   - `snapshot.png`
3. Add metadata entry inside `games.ts`

### How to run:
```
npm install
npm run dev
```

### How to deploy:
- Push to GitHub → connect to Vercel → deploy

---

## 🎨 Styling Requirements
- Clean, modern layout
- Responsive grid & iframe
- Subtle shadows & rounded corners
- Good mobile support
- Dark/neutral background encouraged

---

## 📦 Deliverables AI Must Output

When you feed this spec into AI, it should output:

- Full Next.js project
- All file contents:
  - `layout.tsx`
  - `page.tsx`
  - `play/[slug]/page.tsx`
  - `games.ts`
  - `globals.css`
  - `tailwind.config.js`
  - Full folder structure
- Sample placeholder images/files
- A complete ready-to-run codebase

---

## ✔️ Final Instruction to AI

At the end of your message to the model, add:

> **“Generate the full project exactly according to the above spec, including all source code files.”**
