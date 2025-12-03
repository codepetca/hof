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
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100">
      <div className="absolute top-3 left-3 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-slate-800/80 border border-slate-700 text-slate-100 hover:border-slate-600"
        >
          {"←"} Back
        </Link>
      </div>

      <iframe
        src={game.gameUrl}
        className="w-full h-full border-0"
        allowFullScreen
        title={game.title}
      />
    </div>
  );
}
