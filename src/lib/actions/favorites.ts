"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { favorites } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { fetchGames } from "@/lib/rawg";

export async function updateFavorite(rank: number, gameSlug: string | null) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  if (gameSlug === null) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, session.user.id), eq(favorites.rank, rank)));
  } else {
    await db
      .insert(favorites)
      .values({ userId: session.user.id, gameSlug, rank })
      .onConflictDoUpdate({
        target: [favorites.userId, favorites.rank],
        set: { gameSlug },
      });
  }

  revalidatePath(`/users/${session.user.name}`); // serve pra forçar atualizacao
}

export async function searchGamesAction(query: string) {
  const { games } = await fetchGames(query, 1, undefined, undefined);
  return games.slice(0, 6).map((g) => ({ slug: g.slug, title: g.title, coverUrl: g.coverUrl }));
}