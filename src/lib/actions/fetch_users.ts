"use server";

import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ilike } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function fetchUsers(q: string | undefined, page: number) {
  const session = await getSession();
  if (!session?.user?.id) redirect("/login");

  const whereClause = q
    ? ilike(users.username, `%${q}%`)
    : undefined;

  const [usersPage, total] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
      })
      .from(users)
      .where(whereClause)
      .limit(20)
      .offset((page - 1) * 20),
    db.$count(users, whereClause),
  ]);

  return {
    users: usersPage,
    total,
    totalPages: Math.ceil(total / 20),
  };
}