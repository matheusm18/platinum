"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { follows } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function followUser(followingId: string, profileUsername: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.id === followingId) return;

  await db
    .insert(follows)
    .values({ followerId: session.user.id, followingId })
    .onConflictDoNothing();

  revalidatePath(`/users/${profileUsername}`);
}

export async function unfollowUser(followingId: string, profileUsername: string) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await db
    .delete(follows)
    .where(and(eq(follows.followerId, session.user.id), eq(follows.followingId, followingId)));

  revalidatePath(`/users/${profileUsername}`);
}
