"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { reviews, users } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getGameWithMirror } from "@/lib/games";

export async function saveReview(gameSlug: string, score: number, content: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  await getGameWithMirror(gameSlug);

  const dbScore = Math.round(score * 2);
  if (!Number.isFinite(score) || dbScore < 1 || dbScore > 10) return { success: false };
  if (typeof content !== "string" || content.length > 2000) return { success: false };

  await db
    .insert(reviews)
    .values({ 
      userId, 
      gameSlug, 
      score: dbScore, 
      content: content.trim() || null 
    })
    .onConflictDoUpdate({
      target: [reviews.userId, reviews.gameSlug],
      set: { 
        score: dbScore, 
        content: content.trim() || null, 
        updatedAt: sql`now()` 
      },
    });

  const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, userId));

  revalidatePath(`/games/${gameSlug}`);
  if (user) revalidatePath(`/users/${user.username}`);
  
  return { success: true };
}

export async function deleteReview(gameSlug: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/login");

  await db
    .delete(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.gameSlug, gameSlug)));

  const [user] = await db.select({ username: users.username }).from(users).where(eq(users.id, userId));

  revalidatePath(`/games/${gameSlug}`);
  if (user) revalidatePath(`/users/${user.username}`);
  
  return { success: true };
}