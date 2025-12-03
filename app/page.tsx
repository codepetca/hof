"use client";

import { useMemo, useState } from "react";
import GameGrid from "@/components/game-grid";
import { games } from "@/lib/games";

export default function HomePage() {
  const years = useMemo(() => Array.from(new Set(games.map((game) => game.year))).sort((a, b) => b - a), []);
  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const filtered = useMemo(
    () => (yearFilter === "all" ? games : games.filter((game) => game.year === yearFilter)),
    [yearFilter]
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">GameJam Hall of Fame</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">Grade 10 Games</h1>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="year-select" className="text-sm text-slate-300">
            Year
          </label>
          <select
            id="year-select"
            className="rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 px-3 py-2"
            value={yearFilter === "all" ? "all" : yearFilter.toString()}
            onChange={(e) => {
              const val = e.target.value;
              setYearFilter(val === "all" ? "all" : Number(val));
            }}
          >
            <option value="all">All</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </header>

      <GameGrid games={filtered} />
    </div>
  );
}
