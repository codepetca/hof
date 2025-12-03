# GameJam Hall of Fame (Next.js)

A small, static Next.js site that showcases Grade 10 CodeHS JavaScript Graphics GameJam entries. Games are exported from the CodeHS Sandbox and run inside iframes backed by the files in `public/games/<slug>/`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to browse and play the games.

## Add a new game

1. Create a folder for the game assets: `public/games/<slug>/`.
2. Add the exported files from CodeHS:
   - `index.html` (wraps the CodeHS canvas and loads the library)
   - `game.js` (the downloaded Sandbox file)
   - `snapshot.png` (screenshot or cover image used on the cards)
3. Register the game in `lib/games.ts` by pushing a new `Game` entry with the slug, title, team name, year, description, `snapshot`, `gameUrl`, and optional `tags`.
4. Commit and deploy.

> Each game runs fully inside its own iframe at `/games/<slug>/index.html`, so no backend is needed.

## Deploy

- Push the repository to GitHub.
- Create a new project in Vercel and import the repo.
- Use the default Next.js build command (`next build`) and output (`.next`).
- Enjoy automatic previews on pull requests.

## Project structure

- `app/` - App Router pages: home and dynamic `play/[slug]` route.
- `components/` - UI pieces (game grid with filtering).
- `lib/games.ts` - Game metadata used by both routes.
- `public/games/` - The CodeHS-exported games served in iframes.
- `styles/globals.css` - Tailwind base styles and theme polish.

## Tech

- Next.js (App Router, TypeScript)
- Tailwind CSS for styling
- Fully static output, ready for Vercel
