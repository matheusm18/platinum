import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { follows, users } from "@/db/schema";
import { UserAvatar } from "@/components/UserAvatar";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RemoveFollowerButton } from "@/components/RemoveFollowerButton";

type Props = { params: Promise<{ username: string }> };

export default async function FollowersPage({ params }: Props) {
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

  const isOwner = session.user.id === user.id;

  const followers = await db
    .select({
      id: users.id,
      username: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .innerJoin(follows, eq(follows.followerId, users.id))
    .where(eq(follows.followingId, user.id))
    .orderBy(desc(follows.createdAt));

  return (
    <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-6 px-4 pb-20">
      <div className="border-border/40 flex border-b">
        <Link
          href={`/users/${user.username}/followers`}
          className={cn("relative px-6 py-4 text-sm font-bold text-white transition-colors")}
        >
          Seguidores
        </Link>
        <Link
          href={`/users/${user.username}/following`}
          className={cn(
            "text-silver-dim hover:text-silver relative px-6 py-4 text-sm font-bold transition-colors",
          )}
        >
          Seguindo
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {followers.length > 0 ? (
          followers.map((follower) => (
            <div
              key={follower.username}
              className="group border-border bg-bg-card/20 overflow-hidden rounded-xl border"
            >
              <div className="border-border/50 bg-bg-card/10 flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <Link href={`/users/${follower.username}`}>
                    <UserAvatar
                      username={follower.username}
                      avatarUrl={follower.avatarUrl}
                      size="lg"
                    />
                  </Link>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                    <Link href={`/users/${follower.username}`}>
                      <span className="font-bold text-white">@{follower.username}</span>
                    </Link>
                  </div>
                </div>
                {isOwner && <RemoveFollowerButton followerId={follower.id} username={username} />}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-silver-dim">Ainda não tens seguidores</p>
          </div>
        )}
      </div>
    </div>
  );
}
