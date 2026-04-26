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

export type Genre = { slug: string; name: string };

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
  const res = await fetch(`${BASE_URL}/games/${encodeURIComponent(slug)}?key=${API_KEY}`, {
    next: { revalidate: 3600 * 24 },
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

const PAGE_SIZE = 21;

export async function fetchGenres(): Promise<Genre[]> {
  const params = new URLSearchParams({ key: API_KEY! });
  const res = await fetch(`${BASE_URL}/genres?${params}`, {
    next: { revalidate: 3600 * 24 },
  });
  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`);
  const data: { results: { slug: string; name: string }[] } = await res.json();
  return data.results.map(({ slug, name }) => ({ slug, name }));
}

export async function fetchGames(
  query?: string,
  page = 1,
  genre?: string,
  ordering = "-added",
): Promise<{ games: Game[]; total: number; totalPages: number }> {
  const params = new URLSearchParams({
    key: API_KEY!,
    page_size: String(PAGE_SIZE),
    page: String(page),
    ...(query
      ? { search: query }
      : {
          ordering,
          metacritic: "1,100",
          ...(genre && { genres: genre }),
        }),
  });

  const res = await fetch(`${BASE_URL}/games?${params}`, {
    next: { revalidate: 3600 * 24 },
  });

  if (!res.ok) throw new Error(`RAWG API error: ${res.status}`);

  const data: RawgListResponse = await res.json();
  return {
    games: data.results.map(toGame),
    total: data.count,
    totalPages: Math.ceil(data.count / PAGE_SIZE),
  };
}