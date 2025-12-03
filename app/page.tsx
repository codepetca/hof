"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import GameGrid from "@/components/game-grid";
import { games } from "@/lib/games";

export default function HomePage() {
  const years = useMemo(() => Array.from(new Set(games.map((game) => game.year))).sort((a, b) => b - a), []);
  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const filtered = useMemo(
    () => (yearFilter === "all" ? games : games.filter((game) => game.year === yearFilter)),
    [yearFilter]
  );

  const [filterSlot, setFilterSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setFilterSlot(document.getElementById("year-filter-slot"));
  }, []);

  const dropdown = (
    <select
      id="year-select"
      className="rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 px-3 py-2 text-sm"
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
  );

  return (
    <div className="space-y-4 relative">
      {filterSlot ? createPortal(dropdown, filterSlot) : null}
      <GameGrid games={filtered} />
    </div>
  );
}
