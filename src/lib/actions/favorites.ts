"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { favorites, games, users } from "@/db/schema";
import { and, asc, eq, ilike, isNotNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getGameWithMirror } from "@/lib/games";
import { fetchGames } from "../rawg";

export async function favoriteGame(gameSlug: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  await getGameWithMirror(gameSlug);

  const rankedFavorites = await db
    .select({ rank: favorites.rank })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), isNotNull(favorites.rank)))
    .orderBy(asc(favorites.rank));

  const usedRanks = new Set(rankedFavorites.map((f) => f.rank));
  let nextRank: number | null = null;

  for (let i = 1; i <= 5; i++) {
    if (!usedRanks.has(i)) {
      nextRank = i;
      break;
    }
  }

  await db
    .insert(favorites)
    .values({
      userId,
      gameSlug,
      rank: nextRank,
    })
    .onConflictDoNothing();

  revalidatePath(`/games/${gameSlug}`);
}

export async function unfavoriteGame(gameSlug: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.gameSlug, gameSlug)));

  revalidatePath(`/games/${gameSlug}`);
}

export async function updateFavorite(rank: number, gameSlug: string | null) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  if (!Number.isInteger(rank) || rank < 1 || rank > 5) {
    throw new Error("Rank inválido");
  }

  if (gameSlug !== null && !/^[a-z0-9-]{1,255}$/.test(gameSlug)) {
    throw new Error("Slug inválido");
  }

  await db.transaction(async (tx) => {
    if (gameSlug === null) {
      await tx
        .update(favorites)
        .set({ rank: null })
        .where(and(eq(favorites.userId, userId), eq(favorites.rank, rank)));

      return;
    }

    await getGameWithMirror(gameSlug);

    await tx
      .update(favorites)
      .set({ rank: null })
      .where(and(eq(favorites.userId, userId), eq(favorites.gameSlug, gameSlug)));

    await tx
      .update(favorites)
      .set({ rank: null })
      .where(and(eq(favorites.userId, userId), eq(favorites.rank, rank)));

    await tx
      .insert(favorites)
      .values({
        userId,
        gameSlug,
        rank,
      })
      .onConflictDoUpdate({
        target: [favorites.userId, favorites.gameSlug],
        set: {
          rank,
        },
      });
  });

  const [currentUser] = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (currentUser) {
    revalidatePath(`/users/${currentUser.username}`);
    revalidatePath(`/users/${currentUser.username}/favorites`);
  }

  revalidatePath(`/games/${gameSlug}`);
}

export async function searchGamesAction(query: string) {
  const { games } = await fetchGames(query, 1, undefined, undefined);

  return games.slice(0, 6).map((game) => ({
    slug: game.slug,
    title: game.title,
    coverUrl: game.coverUrl ?? "",
  }));
}

export async function searchFavoriteGames(query: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  const trimmed = query.trim();

  const where = trimmed
    ? and(eq(favorites.userId, userId), ilike(games.title, `%${trimmed}%`))
    : eq(favorites.userId, userId);

  const rows = await db
    .select({
      slug: games.slug,
      title: games.title,
      coverUrl: games.coverUrl,
    })
    .from(favorites)
    .innerJoin(games, eq(favorites.gameSlug, games.slug))
    .where(where)
    .orderBy(asc(favorites.createdAt))
    .limit(5);

  return rows;
}
