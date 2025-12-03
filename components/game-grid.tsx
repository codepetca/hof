import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/lib/games";

type Props = {
  games: Game[];
};

export default function GameGrid({ games }: Props) {
  const sorted = [...games].sort((a, b) => (b.year === a.year ? a.title.localeCompare(b.title) : b.year - a.year));

  return (
    <section id="games" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sorted.map((game) => (
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
                priority={false}
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
