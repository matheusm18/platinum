import { db } from "@/db";
import { games } from "@/db/schema";
import { eq } from "drizzle-orm";
import { fetchGame } from "./rawg";

export async function getGameWithMirror(slug: string) {
  const localGame = await db.query.games.findFirst({
    where: eq(games.slug, slug),
  });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  if (localGame?.lastSyncedAt && localGame.lastSyncedAt > thirtyDaysAgo) {
    return localGame;
  }

  const remoteGame = await fetchGame(slug);

  await db
    .insert(games)
    .values({
      slug: remoteGame.slug,
      title: remoteGame.title,
      coverUrl: remoteGame.coverUrl,
      description: remoteGame.description,
      releaseYear: remoteGame.releaseYear,
      averageScore: remoteGame.averageScore,
      genres: remoteGame.genres,
      platforms: remoteGame.platforms,
      developers: remoteGame.developers,
      publishers: remoteGame.publishers,
      playtime: remoteGame.playtime,
      website: remoteGame.website,
      lastSyncedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: games.slug,
      set: {
        title: remoteGame.title,
        coverUrl: remoteGame.coverUrl,
        description: remoteGame.description,
        releaseYear: remoteGame.releaseYear,
        averageScore: remoteGame.averageScore,
        genres: remoteGame.genres,
        platforms: remoteGame.platforms,
        developers: remoteGame.developers,
        publishers: remoteGame.publishers,
        playtime: remoteGame.playtime,
        website: remoteGame.website,
        lastSyncedAt: new Date(),
      },
    });

  return remoteGame;
}