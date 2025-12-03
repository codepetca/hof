import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "GameJam Hall of Fame",
  description: "Grade 10 Computer Science - Play CodeHS Graphics GameJam winners and favorites."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased text-slate-100 bg-slate-950`}>
        <div className="main-shell">
          <header className="flex items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-3">
              <a
                href="/"
                className="h-11 w-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-400 shadow-glow grid place-items-center text-lg font-black text-slate-950"
                aria-label="GameJam home"
              >
                GJ
              </a>
              <div>
                <p className="text-lg font-semibold">Game Jam Hall of Fame</p>
                <p className="text-sm text-slate-300">10CS</p>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-800/70 pt-6 text-sm text-slate-400">
            &copy; GameJam Hall of Fame - Built for student-created CodeHS JS Graphics games.
          </footer>
        </div>
      </body>
    </html>
  );
}
