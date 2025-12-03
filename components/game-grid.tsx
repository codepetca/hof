"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Game } from "@/lib/games";

type Props = {
  games: Game[];
  years: number[];
};

const buttonBase =
  "px-3 py-2 rounded-xl border text-sm font-semibold transition hover:-translate-y-0.5";

export default function GameGrid({ games, years }: Props) {
  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const sorted = useMemo(
    () => [...games].sort((a, b) => (b.year === a.year ? a.title.localeCompare(b.title) : b.year - a.year)),
    [games]
  );

  const filtered = useMemo(
    () => (yearFilter === "all" ? sorted : sorted.filter((game) => game.year === yearFilter)),
    [sorted, yearFilter]
  );

  return (
    <section id="games" className="space-y-6">
      <div className="surface-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Filter</p>
          <p className="text-lg font-semibold text-white">Browse by year</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setYearFilter("all")}
            className={`${buttonBase} ${
              yearFilter === "all"
                ? "bg-gradient-to-r from-indigo-500/90 to-sky-400 text-slate-950 border-transparent"
                : "bg-slate-900/60 border-slate-800 text-slate-200"
            }`}
          >
            All years
          </button>
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setYearFilter(year)}
              className={`${buttonBase} ${
                yearFilter === year
                  ? "bg-gradient-to-r from-indigo-500/90 to-sky-400 text-slate-950 border-transparent"
                  : "bg-slate-900/60 border-slate-800 text-slate-200"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((game) => (
          <article
            key={game.slug}
            className="surface-card grid-backdrop overflow-hidden border border-slate-800/60"
          >
            <div className="relative w-full overflow-hidden">
              <Image
                src={game.snapshot}
                alt={`${game.title} snapshot`}
                width={800}
                height={500}
                className="h-52 w-full object-cover brightness-105 saturate-125"
                priority={game.slug === filtered[0]?.slug}
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-slate-100 border border-slate-800/70">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400" />
                {game.year}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xl font-semibold text-white">{game.title}</p>
                  <p className="text-sm text-slate-300">{game.teamName}</p>
                </div>
                <Link
                  href={`/play/${game.slug}`}
                  className="button-primary whitespace-nowrap"
                  aria-label={`Play ${game.title}`}
                >
                  Play
                </Link>
              </div>

              <p className="text-sm leading-relaxed text-slate-300">{game.description}</p>

              {game.tags && (
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((tag) => (
                    <span key={tag} className="tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
