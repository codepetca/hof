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
          <Link
            key={game.slug}
            href={`/play/${game.slug}`}
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-2xl"
          >
            <article className="surface-card grid-backdrop overflow-hidden border border-slate-800/60 transition transform group-hover:-translate-y-1 group-hover:border-sky-400/50 group-hover:shadow-sky-900/50 aspect-square">
              <div className="relative w-full overflow-hidden h-2/3">
                <Image
                  src={game.snapshot}
                  alt={`${game.title} snapshot`}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover brightness-105 saturate-125 transition duration-300 group-hover:scale-[1.02]"
                  priority={false}
                />
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-slate-100 border border-slate-800/70">
                  <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400" />
                  {game.year}
                </div>
              </div>

              <div className="p-4 flex items-center gap-3 flex-wrap">
                <p className="text-lg font-semibold text-white">{game.title}</p>
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
          </Link>
        ))}
      </div>
    </section>
  );
}
