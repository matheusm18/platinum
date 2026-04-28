"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users, playQueue } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { fetchGames } from "@/lib/rawg";
import { getGameWithMirror } from "@/lib/games";

export async function updatePlayQueue(position: number, gameSlug: string | null) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  if (!Number.isInteger(position) || position < 1 || position > 5) return;
  if (gameSlug !== null && !/^[a-z0-9-]{1,255}$/.test(gameSlug)) return;

  if (gameSlug === null) {
    await db
      .delete(playQueue)
      .where(and(eq(playQueue.userId, userId), eq(playQueue.position, position)));
  } else {
    await getGameWithMirror(gameSlug);

    await db
      .delete(playQueue)
      .where(and(eq(playQueue.userId, userId), eq(playQueue.gameSlug, gameSlug)));

    await db
      .insert(playQueue)
      .values({ userId, gameSlug, position })
      .onConflictDoUpdate({
        target: [playQueue.userId, playQueue.position],
        set: { gameSlug },
      });
  }

  const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, userId));
  if (user) revalidatePath(`/users/${user.username}`);
}

export async function searchGamesAction(query: string) {
  const { games } = await fetchGames(query, 1, undefined, undefined);
  return games.slice(0, 6).map((g) => ({ 
    slug: g.slug, 
    title: g.title, 
    coverUrl: g.coverUrl 
  }));
}