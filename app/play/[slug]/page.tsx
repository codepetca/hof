import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { games } from "@/lib/games";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

export default async function PlayPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const search = await searchParams;
  const modeParam = search.mode;
  const mode = Array.isArray(modeParam) ? modeParam[0] : modeParam;
  const isImmersive = (mode || "").toLowerCase() === "immersive";

  const game = games.find((entry) => entry.slug === slug);

  if (!game) {
    return notFound();
  }

  if (isImmersive) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100">
        <div className="absolute top-4 left-4 flex flex-wrap gap-3">
          <Link
            href={`/play/${slug}`}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-slate-800/80 border border-slate-700 text-slate-100"
          >
            {"←"} Exit immersive
          </Link>
          <Link href={game.gameUrl} target="_blank" rel="noreferrer" className="button-primary">
            Open in new tab
          </Link>
        </div>

        <div className="w-full h-full flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-6xl aspect-[4/3]">
            <iframe
              src={game.gameUrl}
              className="w-full h-full rounded-2xl border border-slate-800 shadow-2xl shadow-slate-950/60 bg-slate-900"
              allowFullScreen
              title={game.title}
            />
          </div>
        </div>
      </div>
    );
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
          <div className="flex flex-wrap gap-2">
            <Link href={`/play/${slug}?mode=immersive`} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 hover:border-slate-600">
              Immersive mode
            </Link>
            <Link href={game.gameUrl} className="button-primary" target="_blank" rel="noreferrer">
              Open in new tab
            </Link>
          </div>
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
          <span className="tag-pill">Immersive available</span>
        </div>
        <div className="p-3 bg-slate-950/70 rounded-b-2xl">
          <div className="w-full flex justify-center">
            <iframe
              src={game.gameUrl}
              className="w-full max-w-5xl aspect-[4/3] rounded-2xl border border-slate-800 shadow-2xl shadow-slate-950/60 bg-slate-900"
              allowFullScreen
              title={game.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
