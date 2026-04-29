import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users } from "@/db/schema";
import { EditAvatarForm } from "@/components/profile/edit-avatar-form";
import { EditBioForm } from "@/components/profile/edit-bio-form";
import { EditUsernameForm } from "@/components/profile/edit-username-form";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `Editar @${username} — Platinum` };
}

export default async function EditProfilePage({ params }: Props) {
  const { username } = await params;
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user] = await db
    .select({ id: users.id, username: users.username, avatarUrl: users.avatarUrl, bio: users.bio })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    notFound();
  }

  if (user.id !== session.user.id) {
    redirect(`/users/${username}`);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
      <div>
        <Link
          href={`/users/${user.username}`}
          className="text-silver-dim hover:text-silver text-sm underline transition-colors"
        >
          Voltar ao perfil
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Editar perfil</h1>
      </div>

      <section className="border-border bg-bg-card space-y-4 rounded-xl border p-6">
        <h2 className="text-silver text-sm font-semibold tracking-widest uppercase">
          Foto de perfil
        </h2>
        <EditAvatarForm username={user.username} avatarUrl={user.avatarUrl} />
      </section>

      <section className="border-border bg-bg-card space-y-4 rounded-xl border p-6">
        <h2 className="text-silver text-sm font-semibold tracking-widest uppercase">Bio</h2>
        <EditBioForm bio={user.bio} />
      </section>

      <section className="border-border bg-bg-card space-y-4 rounded-xl border p-6">
        <h2 className="text-silver text-sm font-semibold tracking-widest uppercase">Username</h2>
        <EditUsernameForm username={user.username} />
      </section>
    </div>
  );
}
