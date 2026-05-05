import { notFound } from "next/navigation";
import type { Game, GameDetail } from "@/types";

const BASE_URL = "https://api.igdb.com/v4";
const CLIENT_ID = process.env.IGDB_CLIENT_ID!;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET!;

export type Genre = { slug: string; name: string };

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) return tokenCache.token;
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    { method: "POST", cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Twitch token error: ${res.status}`);
  const data: { access_token: string; expires_in: number } = await res.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };
  return tokenCache.token;
}

async function igdbPost<T>(endpoint: string, query: string): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Client-ID": CLIENT_ID,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: query,
    next: { revalidate: 3600 * 24 },
  });
  if (!res.ok) throw new Error(`IGDB error: ${res.status}`);
  return res.json();
}

export function igdbCoverUrl(imageId: string | null | undefined, size = "t_cover_big"): string {
  if (!imageId) return "";
  return `https://images.igdb.com/igdb/image/upload/${size}/${imageId}.jpg`;
}

type IgdbGame = {
  id: number;
  slug: string;
  name: string;
  first_release_date?: number;
  cover?: { image_id: string };
  rating?: number;
  aggregated_rating?: number;
  genres?: { id: number; name: string }[];
  summary?: string;
  platforms?: { name: string }[];
  involved_companies?: { company: { name: string }; developer: boolean; publisher: boolean }[];
  websites?: { url: string; category: number }[];
  screenshots?: { image_id: string }[];
  artworks?: { image_id: string }[];
};

const LIST_FIELDS = `fields id,slug,name,first_release_date,cover.image_id,rating,aggregated_rating,genres.id,genres.name;`;
const DETAIL_FIELDS = `fields id,slug,name,first_release_date,cover.image_id,rating,aggregated_rating,genres.id,genres.name,summary,platforms.name,involved_companies.company.name,involved_companies.developer,involved_companies.publisher,websites.url,websites.category,screenshots.image_id,artworks.image_id;`;

// Main games in IGDB have category = null; expansions/DLCs have explicit values
const BASE_FILTER = `(category = null | category = (0,4,8,9))`;

const ADULT_GENRE_IDS = new Set([36]);

const ORDERING_MAP: Record<string, string> = {
  "-added": "rating_count desc",
  "-rating": "rating desc",
  "-released": "first_release_date desc",
  name: "name asc",
  "-metacritic": "aggregated_rating desc",
};

const PAGE_SIZE = 20;

function scoreOf(raw: IgdbGame): number | null {
  const score = raw.aggregated_rating ?? raw.rating;
  return score != null ? Math.round(score) : null;
}

function toGame(raw: IgdbGame): Game {
  return {
    slug: raw.slug,
    title: raw.name,
    coverUrl: igdbCoverUrl(raw.cover?.image_id),
    genres: raw.genres?.map((g) => g.name) ?? null,
    releaseYear: raw.first_release_date
      ? new Date(raw.first_release_date * 1000).getFullYear()
      : null,
    averageScore: scoreOf(raw),
  };
}

function hasAdultContent(raw: IgdbGame): boolean {
  return raw.genres?.some((g) => ADULT_GENRE_IDS.has(g.id)) ?? false;
}

export async function fetchGenres(): Promise<Genre[]> {
  const genres = await igdbPost<{ id: number; name: string }[]>(
    "genres",
    `fields id,name; limit 30;`,
  );
  return genres.map(({ id, name }) => ({ slug: String(id), name }));
}

export async function fetchGames(
  query?: string,
  page = 1,
  genre?: string,
  ordering = "-added",
): Promise<{ games: Game[]; total: number; totalPages: number }> {
  const offset = (page - 1) * PAGE_SIZE;
  const sort = ORDERING_MAP[ordering] ?? "rating_count desc";

  let listQuery: string;
  let countQuery: string;

  if (query) {
    const safe = query.replace(/"/g, "");
    listQuery = `${LIST_FIELDS} search "${safe}"; where ${BASE_FILTER}; limit ${PAGE_SIZE}; offset ${offset};`;
    countQuery = `where ${BASE_FILTER};`;
  } else {
    const genreFilter = genre ? ` & genres = (${genre})` : "";
    const where = `where ${BASE_FILTER}${genreFilter} & rating_count > 3;`;
    listQuery = `${LIST_FIELDS} ${where} sort ${sort}; limit ${PAGE_SIZE}; offset ${offset};`;
    countQuery = where;
  }

  const [results, countResult] = await Promise.all([
    igdbPost<IgdbGame[]>("games", listQuery),
    igdbPost<{ count: number }>("games/count", countQuery),
  ]);

  const games = results.filter((g) => !hasAdultContent(g)).map(toGame);

  return {
    games,
    total: countResult.count,
    totalPages: Math.ceil(countResult.count / PAGE_SIZE),
  };
}

export async function fetchGame(slug: string): Promise<GameDetail> {
  const safe = slug.replace(/"/g, "");
  const results = await igdbPost<IgdbGame[]>(
    "games",
    `${DETAIL_FIELDS} where slug = "${safe}"; limit 1;`,
  );

  if (!results.length) notFound();
  const raw = results[0];

  if (hasAdultContent(raw)) notFound();

  const developers =
    raw.involved_companies?.filter((c) => c.developer).map((c) => c.company.name) ?? [];
  const publishers =
    raw.involved_companies?.filter((c) => c.publisher).map((c) => c.company.name) ?? [];
  const website = raw.websites?.find((w) => w.category === 1)?.url ?? null;

  return {
    slug: raw.slug,
    title: raw.name,
    coverUrl: igdbCoverUrl(raw.cover?.image_id),
    genres: raw.genres?.map((g) => g.name) ?? null,
    releaseYear: raw.first_release_date
      ? new Date(raw.first_release_date * 1000).getFullYear()
      : null,
    averageScore: scoreOf(raw),
    description: raw.summary ?? "",
    platforms: raw.platforms?.map((p) => p.name) ?? [],
    developers,
    publishers,
    playtime: null,
    website,
    screenshotUrl:
      igdbCoverUrl(raw.artworks?.[0]?.image_id, "t_1080p") ||
      igdbCoverUrl(raw.screenshots?.[0]?.image_id, "t_1080p") ||
      null,
  };
}
