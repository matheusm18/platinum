import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { EditAvatarForm } from "@/components/profile/edit-avatar-form";
import { EditUsernameForm } from "@/components/profile/edit-username-form";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `Editar @${username} — Platinum` };
}

export default async function EditProfilePage({ params }: Props) {
  const { username } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user] = await db
    .select({ id: users.id, username: users.username, avatarUrl: users.avatarUrl })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    notFound();
  }

  if (user.id !== session.user.id) {
    redirect(`/profile/${username}`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <Link href={`/profile/${user.username}`} className="text-sm text-silver-dim hover:text-silver transition-colors underline">
            Voltar ao perfil
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Editar perfil</h1>
      </div>

      <section className="rounded-xl border border-border bg-bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-silver uppercase tracking-widest">Foto de perfil</h2>
        <EditAvatarForm username={user.username} avatarUrl={user.avatarUrl} />
      </section>

      <section className="rounded-xl border border-border bg-bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold text-silver uppercase tracking-widest">Username</h2>
        <EditUsernameForm username={user.username} />
      </section>
    </div>
  );
}