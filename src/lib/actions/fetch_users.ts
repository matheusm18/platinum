"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ilike } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function fetchUsers(q: string | undefined, page: number) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const whereClause = q
    ? ilike(users.username, `%${q}%`)
    : undefined;

  const usersPage = await db
    .select({
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
    })
    .from(users)
    .where(whereClause)
    .limit(20)
    .offset((page - 1) * 20);

  const total = await db.$count(users, whereClause);

  return {
    users: usersPage,
    total,
    totalPages: Math.ceil(total / 20),
  };
}