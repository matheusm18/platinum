import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const isProduction = process.env.NODE_ENV === "production";

const r2 = isProduction ? new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
}) : null;

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

  const [user] = await db.select({ avatarUpdatedAt: users.avatarUpdatedAt }).from(users).where(eq(users.id, userId));
  if (user?.avatarUpdatedAt) {
    const secondsSinceLastUpload = (Date.now() - user.avatarUpdatedAt.getTime()) / 1000;
    if (secondsSinceLastUpload < 60) {
      const retryAfter = Math.ceil(60 - secondsSinceLastUpload);
      return NextResponse.json(
        { error: `Aguarda ${retryAfter}s antes de atualizar o avatar novamente` },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }
  }

  let avatarUrl: string;

  if (isProduction) {
    const key = `avatars/${userId}/avatar.webp`;

    await r2!.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: outputBuffer,
      ContentType: "image/webp",
    }));

    avatarUrl = `${process.env.R2_PUBLIC_URL}/${key}?v=${Date.now()}`;
  } else {

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
    
    avatarUrl = `/uploads/avatars/${userId}/${filename}?v=${Date.now()}`;
  }

  await db.update(users).set({ avatarUrl, avatarUpdatedAt: new Date() }).where(eq(users.id, userId));

  return NextResponse.json({ avatarUrl });
}