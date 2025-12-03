import gamesData from "@/data/games.json";

export type Game = {
  slug: string;
  title: string;
  teamName: string;
  year: number;
  description: string;
  snapshot: string;
  gameUrl: string;
  tags?: string[];
};

export const games: Game[] = gamesData;
