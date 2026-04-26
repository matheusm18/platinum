import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (!USERNAME_PATTERN.test(String(username).trim())) {
      return NextResponse.json({ error: "Username inválido" }, { status: 400 });
    }

    if (!EMAIL_PATTERN.test(String(email).trim())) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (String(password).length < 8) {
      return NextResponse.json({ error: "Password deve ter pelo menos 8 caracteres" }, { status: 400 });
    }

    const normalizedUsername = String(username).trim();
    const normalizedEmail = String(email).trim().toLowerCase();

    const [existing] = await db
      .select()
      .from(users)
      .where(or(
        eq(users.email, normalizedEmail),
        eq(sql`lower(${users.username})`, normalizedUsername.toLowerCase()),
      ))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "Email ou username já está em uso" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const [user] = await db
      .insert(users)
      .values({ username: normalizedUsername, email: normalizedEmail, passwordHash })
      .returning({ id: users.id, username: users.username });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
