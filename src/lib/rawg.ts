import type { Game } from "@/types";

const BASE_URL = "https://api.rawg.io/api";
const API_KEY = process.env.RAWG_API_KEY;

type RawgGame = {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  metacritic: number | null;
  genres: { id: number; name: string }[];
};

type RawgListResponse = {
  count: number;
  results: RawgGame[];
};

function toGame(raw: RawgGame): Game {
  return {
    id: String(raw.id),
    slug: raw.slug,
    title: raw.name,
    coverUrl: raw.background_image ?? "",
    genres: raw.genres.map((g) => g.name),
    releaseYear: raw.released ? Number(raw.released.slice(0, 4)) : 0,
    averageScore: raw.metacritic,
  };
}

export async function fetchGames(query?: string): Promise<Game[]> {
  const params = new URLSearchParams({
    key: API_KEY!,
    page_size: "40",
    ordering: "-metacritic",
    metacritic: "1,100",
    ...(query && { search: query }),
  });

  const res = await fetch(`${BASE_URL}/games?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`);

  const data: RawgListResponse = await res.json();
  return data.results.map(toGame);
}