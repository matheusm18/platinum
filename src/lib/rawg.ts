import type { Game, GameDetail } from "@/types";

const BASE_URL = "https://api.rawg.io/api";
const API_KEY = process.env.RAWG_API_KEY;

type RawgGameDetail = {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  metacritic: number | null;
  genres: { id: number; name: string }[];
  description_raw: string;
  platforms: { platform: { id: number; name: string } }[];
  developers: { id: number; name: string }[];
  publishers: { id: number; name: string }[];
  playtime: number;
  website: string;
};

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

export async function fetchGame(slug: string): Promise<GameDetail> {
  const res = await fetch(`${BASE_URL}/games/${slug}?key=${API_KEY}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`);

  const raw: RawgGameDetail = await res.json();

  return {
    id: String(raw.id),
    slug: raw.slug,
    title: raw.name,
    coverUrl: raw.background_image ?? "",
    genres: raw.genres.map((g) => g.name),
    releaseYear: raw.released ? Number(raw.released.slice(0, 4)) : 0,
    averageScore: raw.metacritic,
    description: raw.description_raw,
    platforms: raw.platforms.map((p) => p.platform.name),
    developers: raw.developers.map((d) => d.name),
    publishers: raw.publishers.map((p) => p.name),
    playtime: raw.playtime || null,
    website: raw.website || null,
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