"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { userGotyRankingItems, userGotyRankings, users } from "@/db/schema";
import { gotyYears } from "@/lib/goty-data";
import { getGameWithMirror } from "@/lib/games";

const gotySlugsByYear = new Map(
  gotyYears.map((year) => [year.year, new Set(year.nominees.map((nominee) => nominee.slug))]),
);

export async function saveGotyRanking(
  year: number,
  ranking: Array<string | null>,
  isPinned: boolean,
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  const validSlugs = gotySlugsByYear.get(year);
  if (!validSlugs) throw new Error("Ano GOTY inválido");

  const selectedSlugs = ranking.filter((slug): slug is string => Boolean(slug));
  if (selectedSlugs.length !== 5) throw new Error("Escolhe exatamente 5 jogos");

  const uniqueSlugs = new Set(selectedSlugs);
  if (uniqueSlugs.size !== selectedSlugs.length) throw new Error("Ranking com jogos repetidos");

  for (const slug of selectedSlugs) {
    if (!/^[a-z0-9-]{1,255}$/.test(slug) || !validSlugs.has(slug)) {
      throw new Error("Jogo inválido para este ano GOTY");
    }
  }

  await Promise.all(selectedSlugs.map((slug) => getGameWithMirror(slug)));

  const [currentUser] = await db
    .select({ username: users.username })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  await db.transaction(async (tx) => {
    const [rankingRow] = await tx
      .insert(userGotyRankings)
      .values({
        userId,
        year,
        isPinned,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userGotyRankings.userId, userGotyRankings.year],
        set: {
          isPinned,
          updatedAt: new Date(),
        },
      })
      .returning({ id: userGotyRankings.id });

    await tx.delete(userGotyRankingItems).where(eq(userGotyRankingItems.rankingId, rankingRow.id));

    await tx.insert(userGotyRankingItems).values(
      selectedSlugs.map((slug, index) => ({
        rankingId: rankingRow.id,
        gameSlug: slug,
        rank: index + 1,
      })),
    );
  });

  revalidatePath("/goty");
  revalidatePath(`/goty?year=${year}`);

  if (currentUser) {
    revalidatePath(`/users/${currentUser.username}`);
  }
}

export async function getUserGotyRankings(userId: string) {
  const rows = await db
    .select({
      rankingId: userGotyRankings.id,
      year: userGotyRankings.year,
      isPinned: userGotyRankings.isPinned,
      gameSlug: userGotyRankingItems.gameSlug,
      rank: userGotyRankingItems.rank,
    })
    .from(userGotyRankings)
    .leftJoin(userGotyRankingItems, eq(userGotyRankingItems.rankingId, userGotyRankings.id))
    .where(eq(userGotyRankings.userId, userId));

  const rankings: Record<number, string[]> = {};
  const pinnedYears = new Set<number>();

  for (const row of rows) {
    rankings[row.year] ??= [];
    if (row.isPinned) pinnedYears.add(row.year);
    if (row.gameSlug && row.rank) rankings[row.year][row.rank - 1] = row.gameSlug;
  }

  return { rankings, pinnedYears: Array.from(pinnedYears) };
}

export async function getPinnedGotyRankings(userId: string) {
  const rankings = await db
    .select({
      id: userGotyRankings.id,
      year: userGotyRankings.year,
    })
    .from(userGotyRankings)
    .where(and(eq(userGotyRankings.userId, userId), eq(userGotyRankings.isPinned, true)))
    .orderBy(desc(userGotyRankings.year));

  if (rankings.length === 0) return [];

  const items = await db.query.userGotyRankingItems.findMany({
    where: (table) =>
      inArray(
        table.rankingId,
        rankings.map((ranking) => ranking.id),
      ),
    orderBy: [asc(userGotyRankingItems.rank)],
  });

  if (items.length === 0) return [];

  const games = await db.query.games.findMany({
    where: (table) =>
      inArray(
        table.slug,
        items.map((item) => item.gameSlug),
      ),
  });

  const gameBySlug = new Map(games.map((game) => [game.slug, game]));
  const itemsByRankingId = new Map<string, typeof items>();

  for (const item of items) {
    const existingItems = itemsByRankingId.get(item.rankingId) ?? [];
    existingItems.push(item);
    itemsByRankingId.set(item.rankingId, existingItems);
  }

  return rankings
    .map((ranking) => ({
      year: ranking.year,
      items: (itemsByRankingId.get(ranking.id) ?? []).map((item) => ({
        rank: item.rank,
        game: gameBySlug.get(item.gameSlug) ?? null,
        gameSlug: item.gameSlug,
      })),
    }))
    .filter((ranking) => ranking.items.length > 0);
}
