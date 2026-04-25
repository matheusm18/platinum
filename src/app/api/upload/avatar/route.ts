import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import sharp from "sharp";
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Ficheiro inválido" }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Ficheiro demasiado grande (máx. 5 MB)" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return NextResponse.json({ error: "Tipo de ficheiro não suportado" }, { status: 400 });
  }

  const inputBuffer = Buffer.from(await file.arrayBuffer());

  let outputBuffer: Buffer;
  try {
    outputBuffer = await sharp(inputBuffer, { limitInputPixels: 25_000_000 })
      .rotate()
      .resize({ width: 512, height: 512, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    return NextResponse.json({ error: "Ficheiro de imagem inválido" }, { status: 400 });
  }

  const userId = session.user.id;
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
  const userDir = path.join(uploadsDir, userId);
  await mkdir(userDir, { recursive: true });

  for (const oldExt of ["jpg", "png", "webp"] as const) {
    try {
      await unlink(path.join(uploadsDir, `${userId}.${oldExt}`));
    } catch {
    }

    try {
      await unlink(path.join(userDir, `avatar.${oldExt}`));
    } catch {
    }
  }

  const filename = "avatar.webp";
  await writeFile(path.join(userDir, filename), outputBuffer);

  const avatarUrl = `/uploads/avatars/${userId}/${filename}?v=${Date.now()}`;

  await db.update(users).set({ avatarUrl }).where(eq(users.id, userId));

  return NextResponse.json({ avatarUrl });
}