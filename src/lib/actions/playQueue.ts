"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { playQueue, games, users } from "@/db/schema";
import { and, asc, eq, ilike, isNotNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getGameWithMirror } from "@/lib/games";
export async function addToQueue(gameSlug: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  await getGameWithMirror(gameSlug);

  const positionedQueue = await db
    .select({ position: playQueue.position })
    .from(playQueue)
    .where(and(eq(playQueue.userId, userId), isNotNull(playQueue.position)))
    .orderBy(asc(playQueue.position));

  const usedRanks = new Set(positionedQueue.map((f) => f.position));
  let nextPosition: number | null = null;

  for (let i = 1; i <= 5; i++) {
    if (!usedRanks.has(i)) {
      nextPosition = i;
      break;
    }
  }

  await db
    .insert(playQueue)
    .values({
      userId,
      gameSlug,
      position: nextPosition,
    })
    .onConflictDoNothing();

  revalidatePath(`/games/${gameSlug}`);
}

export async function removeFromQueue(gameSlug: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  await db
    .delete(playQueue)
    .where(and(eq(playQueue.userId, userId), eq(playQueue.gameSlug, gameSlug)));

  revalidatePath(`/games/${gameSlug}`);
}

export async function updatePlayQueue(position: number, gameSlug: string | null) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  if (!Number.isInteger(position) || position < 1 || position > 5) {
    throw new Error("Position inválida");
  }

  if (gameSlug !== null && !/^[a-z0-9-]{1,255}$/.test(gameSlug)) {
    throw new Error("Slug inválido");
  }

  await db.transaction(async (tx) => {
    if (gameSlug === null) {
      await tx
        .update(playQueue)
        .set({ position: null })
        .where(and(eq(playQueue.userId, userId), eq(playQueue.position, position)));

      return;
    }

    await getGameWithMirror(gameSlug);

    await tx
      .update(playQueue)
      .set({ position: null })
      .where(and(eq(playQueue.userId, userId), eq(playQueue.gameSlug, gameSlug)));

    await tx
      .update(playQueue)
      .set({ position: null })
      .where(and(eq(playQueue.userId, userId), eq(playQueue.position, position)));

    await tx
      .insert(playQueue)
      .values({
        userId,
        gameSlug,
        position,
      })
      .onConflictDoUpdate({
        target: [playQueue.userId, playQueue.gameSlug],
        set: {
          position,
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
    revalidatePath(`/users/${currentUser.username}/play-queue`);
  }

  revalidatePath(`/games/${gameSlug}`);
}

export async function searchQueuedGames(query: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/login");

  const trimmed = query.trim();

  const where = trimmed
    ? and(eq(playQueue.userId, userId), ilike(games.title, `%${trimmed}%`))
    : eq(playQueue.userId, userId);

  const rows = await db
    .select({
      slug: games.slug,
      title: games.title,
      coverUrl: games.coverUrl,
    })
    .from(playQueue)
    .innerJoin(games, eq(playQueue.gameSlug, games.slug))
    .where(where)
    .orderBy(asc(playQueue.createdAt))
    .limit(5);

  return rows;
}
