"use server";

import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { follows } from "@/db/schema";
import { auth } from "@/auth";

export async function removeFollower(followerId: string, username: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  if (!followerId) {
    throw new Error("ID do seguidor inválido");
  }

  await db
    .delete(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, session.user.id)));

  revalidatePath(`/users/${username}/followers`);
}

export async function removeFollowing(followingId: string, username: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  if (!followingId) {
    throw new Error("ID do utilizador inválido");
  }

  await db
    .delete(follows)
    .where(and(eq(follows.followerId, session.user.id), eq(follows.followingId, followingId)));

  revalidatePath(`/users/${username}/following`);
}
