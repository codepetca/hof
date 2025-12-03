import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface-card p-8 space-y-4 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">404</p>
      <h1 className="text-3xl font-semibold text-white">Game not found</h1>
      <p className="text-slate-300 max-w-xl mx-auto">
        The game you are looking for is not in this Hall of Fame yet. Pick another or add a new
        entry through <code>public/games/&lt;slug&gt;</code>.
      </p>
      <div className="flex justify-center">
        <Link href="/" className="button-primary">
          Back to Hall of Fame
        </Link>
      </div>
    </div>
  );
}
