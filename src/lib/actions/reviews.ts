"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveReview(gameSlug: string, score: number, content: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const dbScore = Math.round(score * 2);

  await db
    .insert(reviews)
    .values({ userId: session.user.id, gameSlug, score: dbScore, content: content.trim() || null })
    .onConflictDoUpdate({
      target: [reviews.userId, reviews.gameSlug],
      set: { score: dbScore, content: content.trim() || null, updatedAt: sql`now()` },
    });

  revalidatePath(`/games/${gameSlug}`);
  return { success: true };
}

export async function deleteReview(gameSlug: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await db
    .delete(reviews)
    .where(and(eq(reviews.userId, session.user.id), eq(reviews.gameSlug, gameSlug)));

  revalidatePath(`/games/${gameSlug}`);
  return { success: true };
}
