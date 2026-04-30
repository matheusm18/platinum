import { eq, desc, and, not } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users, games, reviews, follows } from "@/db/schema";
import { UserAvatar } from "@/components/UserAvatar";
import { ReviewCard } from "@/components/ReviewCard";
import { redirect } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  const userId = session?.user?.id;
  const { tab } = await searchParams;
  const activeTab = tab === "explore" ? "explore" : "following";

  if (!userId) redirect("/login");

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, userId!));

  let reviewsWithGames;

  if (activeTab === "explore") {
    reviewsWithGames = await db
      .select({
        review: reviews,
        game: games,
        author: {
          username: users.username,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(reviews)
      .innerJoin(games, eq(reviews.gameSlug, games.slug))
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(not(eq(reviews.userId, user.id)))
      .orderBy(desc(reviews.updatedAt))
      .limit(20);
  } else {
    reviewsWithGames = await db
      .select({
        review: reviews,
        game: games,
        author: {
          username: users.username,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(reviews)
      .innerJoin(games, eq(reviews.gameSlug, games.slug))
      .innerJoin(
        follows,
        and(eq(follows.followingId, reviews.userId), eq(follows.followerId, user.id)),
      )
      .innerJoin(users, eq(reviews.userId, users.id))
      .orderBy(desc(reviews.updatedAt))
      .limit(20);
  }

  return (
    <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col gap-6 px-4 pb-20">
      <div className="border-border/40 flex border-b">
        <Link
          href="/feed"
          className={cn(
            "relative px-6 py-4 text-sm font-bold transition-colors",
            activeTab === "following" ? "text-white" : "text-silver-dim hover:text-silver",
          )}
        >
          Seguindo
          {activeTab === "following" && (
            <div className="bg-silver absolute right-0 bottom-0 left-0 h-0.5" />
          )}
        </Link>
        <Link
          href="/feed?tab=explore"
          className={cn(
            "relative px-6 py-4 text-sm font-bold transition-colors",
            activeTab === "explore" ? "text-white" : "text-silver-dim hover:text-silver",
          )}
        >
          Explorar
          {activeTab === "explore" && (
            <div className="bg-silver absolute right-0 bottom-0 left-0 h-0.5" />
          )}
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {reviewsWithGames.length > 0 ? (
          reviewsWithGames.map(({ review, game, author }) => (
            <div
              key={`${review.userId}-${game.slug}`}
              className="group border-border bg-bg-card/20 overflow-hidden rounded-xl border"
            >
              <div className="border-border/50 bg-bg-card/10 flex items-center justify-between border-b p-4">
                <div className="flex items-center gap-3">
                  <Link href={`/users/${author.username}`}>
                    <UserAvatar username={author.username} avatarUrl={author.avatarUrl} size="sm" />
                  </Link>

                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                    <Link href={`/users/${author.username}`}>
                      <span className="font-bold text-white">@{author.username}</span>
                    </Link>
                    <span className="text-silver-dim">avaliou um jogo</span>
                  </div>
                </div>

                <span className="text-silver-dim text-xs font-semibold tracking-widest uppercase opacity-40">
                  {formatRelativeTime(review.updatedAt)}
                </span>
              </div>

              <div className="p-4">
                <ReviewCard
                  size="default"
                  gameSlug={game.slug}
                  title={game.title}
                  score={review.score}
                  content={review.content}
                  coverUrl={game.coverUrl}
                  className="border-none bg-transparent p-0"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-silver-dim">
              {activeTab === "following"
                ? "Ainda não segues ninguém ou os teus amigos ainda não fizeram reviews."
                : "Ainda não existem reviews globais."}
            </p>
            {activeTab === "following" && (
              <Link
                href="/feed?tab=explore"
                className="text-silver mt-4 inline-block text-sm underline"
              >
                Explorar o que o mundo está a jogar
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
