import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games } from "@/lib/games";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = games.find((entry) => entry.slug === slug);

  if (!game) {
    return {
      title: "Game not found | GameJam Hall of Fame",
      description: "The requested game does not exist."
    };
  }

  return {
    title: `${game.title} - Play | GameJam Hall of Fame`,
    description: game.description,
    openGraph: {
      title: `${game.title} - GameJam Hall of Fame`,
      description: game.description,
      images: [game.snapshot]
    }
  };
}

export default async function PlayPage({ params }: Props) {
  const { slug } = await params;
  const game = games.find((entry) => entry.slug === slug);

  if (!game) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white">
        <span className="text-lg">{"<-"}</span>
        Back to games
      </Link>

      <div className="surface-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{game.year}</p>
            <h1 className="text-3xl font-semibold text-white">{game.title}</h1>
            <p className="text-slate-300">By {game.teamName}</p>
          </div>
          <Link href={game.gameUrl} className="button-primary" target="_blank" rel="noreferrer">
            Open in new tab
          </Link>
        </div>
        <p className="text-slate-300 leading-relaxed">{game.description}</p>
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

      <div className="surface-card border border-slate-800/70">
        <div className="p-4 flex items-center justify-between text-sm text-slate-300 border-b border-slate-800/70">
          <p>
            Game iframe - served from <code>{game.gameUrl}</code>
          </p>
          <span className="tag-pill">800 x 600</span>
        </div>
        <div className="p-3 bg-slate-950/70 rounded-b-2xl overflow-auto">
          <div className="w-full flex justify-center">
            <iframe
              src={game.gameUrl}
              width={800}
              height={600}
              className="rounded-xl border border-slate-800 shadow-2xl shadow-slate-950/60"
              title={game.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
