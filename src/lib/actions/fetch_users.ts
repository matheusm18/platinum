"use server";

import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ilike } from "drizzle-orm";
import { redirect } from "next/navigation";

const PAGE_SIZE = 21;

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
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.$count(users, whereClause),
  ]);

  return {
    users: usersPage,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}