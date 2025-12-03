import GameGrid from "@/components/game-grid";
import { games } from "@/lib/games";

export default function HomePage() {
  const years = Array.from(new Set(games.map((game) => game.year))).sort((a, b) => b - a);
  const latestYear = years[0];

  return (
    <div className="space-y-8">
      <section className="surface-card p-8 lg:p-10 grid gap-8 lg:grid-cols-[1.3fr,1fr] items-center">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Grade 10 Showcase</p>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight text-white">
            GameJam Hall of Fame
          </h1>
          <p className="text-base text-slate-200">Grade 10 Computer Science - Student-Created Games</p>
          <p className="text-lg text-slate-300 max-w-2xl">
            Student-created CodeHS JavaScript Graphics games, playable right in your browser. Filter by
            year and jump into each team&apos;s best work.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            <div className="tag-pill">{games.length} games</div>
            <div className="tag-pill">{years.length} years</div>
            <div className="tag-pill">Latest: {latestYear}</div>
          </div>
        </div>

        <div className="surface-card bg-slate-900/70 border border-slate-800/70 p-6 rounded-2xl shadow-inner shadow-black/50">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-400">How it works</p>
              <p className="text-lg font-semibold text-white">Play via secure iframes</p>
            </div>
            <ol className="space-y-2 text-sm text-slate-300 list-decimal list-inside">
              <li>Choose a game below.</li>
              <li>We load its CodeHS-exported files from <code>public/games/&lt;slug&gt;</code>.</li>
              <li>The game runs inside its own iframe for safety.</li>
            </ol>
            <p className="text-xs text-slate-400">Want to add another? See README instructions.</p>
          </div>
        </div>
      </section>

      <GameGrid games={games} years={years} />
    </div>
  );
}
