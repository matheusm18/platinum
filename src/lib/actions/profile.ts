"use server";

import { auth, signOut } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq, not, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export type UsernameState = { error: string | null };
export type BioState = { error: string | null };

export async function updateBio(
  _prev: BioState,
  formData: FormData
): Promise<BioState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const bio = ((formData.get("bio") as string) ?? "").trim();

  if (bio.length > 150) {
    return { error: "A bio não pode ter mais de 150 caracteres." };
  }

  try {
    await db.update(users).set({ bio: bio || null }).where(eq(users.id, session.user.id));
  } catch {
    return { error: "Erro ao guardar bio." };
  }

  redirect(`/users/${session.user.name}`);
}

export async function updateUsername(
  _prev: UsernameState,
  formData: FormData
): Promise<UsernameState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const newUsername = ((formData.get("username") as string) ?? "").trim();

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(newUsername)) {
    return { error: "3 a 20 caracteres — só letras, números e _" };
  }

  if (newUsername === session.user.name) {
    return { error: "O username deve ser diferente do atual!" };
  }

  const [existingUsername] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(
      eq(sql`lower(${users.username})`, newUsername.toLowerCase()),
      not(eq(users.id, session.user.id)),
    ))
    .limit(1);

  if (existingUsername) {
    return { error: "Esse username já está em uso!" };
  }

  try {
    await db.update(users).set({ username: newUsername }).where(eq(users.id, session.user.id));
  } catch {
    return { error: "Erro ao guardar username!" };
  }

  await signOut({ redirectTo: "/login" });
  return { error: null };
}