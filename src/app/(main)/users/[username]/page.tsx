import { notFound, redirect } from "next/navigation";
import { eq, asc, desc, sql, and } from "drizzle-orm";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users, games, reviews, favorites, playQueue, follows } from "@/db/schema";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/ReviewCard";
import { SlotPicker, type Slot } from "@/components/SlotPicker";
import { updateFavorite, searchFavoriteGames } from "@/lib/actions/favorites";
import { searchQueuedGames, updatePlayQueue } from "@/lib/actions/playQueue";
import { FollowButton } from "@/components/FollowButton";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username} — Platinum` };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const [[user], session] = await Promise.all([
    db
      .select()
      .from(users)
      .where(eq(sql`lower(${users.username})`, username.toLowerCase()))
      .limit(1),
    getSession(),
  ]);

  if (!user) notFound();
  if (username !== user.username) redirect(`/users/${user.username}`);

  const isOwner = session?.user?.id === user.id;

  const [
    reviewsWithGames,
    favoritesWithGames,
    queueWithGames,
    [{ totalReviews }],
    [{ followerCount }],
    [{ followingCount }],
    followRow,
  ] = await Promise.all([
    db
      .select({ review: reviews, game: games })
      .from(reviews)
      .innerJoin(games, eq(reviews.gameSlug, games.slug))
      .where(eq(reviews.userId, user.id))
      .orderBy(desc(reviews.updatedAt))
      .limit(20),

    db
      .select({ fav: favorites, game: games })
      .from(favorites)
      .innerJoin(games, eq(favorites.gameSlug, games.slug))
      .where(eq(favorites.userId, user.id))
      .orderBy(asc(favorites.rank)),

    db
      .select({ q: playQueue, game: games })
      .from(playQueue)
      .innerJoin(games, eq(playQueue.gameSlug, games.slug))
      .where(eq(playQueue.userId, user.id))
      .orderBy(asc(playQueue.position)),

    db
      .select({ totalReviews: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.userId, user.id)),
    db
      .select({ followerCount: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followingId, user.id)),
    db
      .select({ followingCount: sql<number>`count(*)` })
      .from(follows)
      .where(eq(follows.followerId, user.id)),
    session?.user?.id && !isOwner
      ? db
          .select({ followerId: follows.followerId })
          .from(follows)
          .where(and(eq(follows.followerId, session.user.id), eq(follows.followingId, user.id)))
          .limit(1)
      : Promise.resolve([]),
  ]);

  const isFollowing = followRow && followRow.length > 0;
  const joinedDate = user.createdAt.toLocaleDateString("pt-PT", {
    month: "long",
    year: "numeric",
  });

  const favoriteSlots: Slot[] = Array.from({ length: 5 }, (_, i) => {
    const position = i + 1;
    const item = favoritesWithGames.find((f) => f.fav.rank === position);
    return {
      position,
      slug: item?.fav.gameSlug ?? null,
      title: item?.game.title ?? null,
      coverUrl: item?.game.coverUrl ?? null,
    };
  });

  const playQueueSlots: Slot[] = Array.from({ length: 5 }, (_, i) => {
    const position = i + 1;
    const item = queueWithGames.find((q) => q.q.position === position);
    return {
      position,
      slug: item?.q.gameSlug ?? null,
      title: item?.game.title ?? null,
      coverUrl: item?.game.coverUrl ?? null,
    };
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
        <UserAvatar username={user.username} avatarUrl={user.avatarUrl} size="xl" />

        <div className="flex flex-1 flex-col items-center md:items-start">
          <div className="flex-w-full flex-col items-center justify-between gap-4 md:flex-row md:items-start">
            <div className="flex flex-col items-center md:items-start"></div>
            <h1 className="text-2xl font-bold text-white">@{user.username}</h1>
            <p className="text-silver-dim mt-1 text-sm">Membro desde {joinedDate}</p>
            {user.bio && <p className="text-silver mt-1 max-w-sm text-sm">{user.bio}</p>}

            <div className="mt w-full md:w-auto">
              {isOwner ? (
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border-border bg-bg-card hover:bg-bg mt-3 w-full md:w-auto"
                >
                  <Link href={`/users/${user.username}/edit`}>Editar perfil</Link>
                </Button>
              ) : (
                session?.user && (
                  <FollowButton
                    followingId={user.id}
                    profileUsername={user.username}
                    isFollowing={isFollowing}
                  />
                )
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 md:justify-start">
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-white">{totalReviews}</span>
                <span className="text-silver-dim ml-1.5 text-sm">avaliações</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-white">{favoritesWithGames.length}</span>
                <span className="text-silver-dim ml-1.5 text-sm">favoritos</span>
              </div>
              <div>
                <Link
                  href={`/users/${user.username}/followers`}
                  className="flex items-baseline gap-1.5"
                >
                  <span className="font-semibold text-white">{followerCount}</span>
                  <span className="text-silver-dim ml-1.5 text-sm">seguidores</span>
                </Link>
              </div>
              <div>
                <Link
                  href={`/users/${user.username}/following`}
                  className="flex items-baseline gap-1.5"
                >
                  <span className="font-semibold text-white">{followingCount}</span>
                  <span className="text-silver-dim ml-1.5 text-sm">seguindo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlotPicker
        slots={favoriteSlots}
        isOwner={isOwner}
        label="Jogos favoritos"
        buttonText="Ver mais →"
        buttonHref={`/users/${user.username}/favorites`}
        hrefPrefix="/games/"
        onSave={updateFavorite}
        onSearch={searchFavoriteGames}
      />

      <SlotPicker
        slots={playQueueSlots}
        isOwner={isOwner}
        label="Quero jogar"
        buttonText="Ver mais →"
        buttonHref={`/users/${user.username}/play-queue`}
        hrefPrefix="/games/"
        onSave={updatePlayQueue}
        onSearch={searchQueuedGames}
      />

      <section>
        <h2 className="text-silver-dim mb-4 text-xs font-semibold tracking-widest uppercase">
          Avaliações recentes
        </h2>

        {reviewsWithGames.length === 0 ? (
          <p className="text-silver-dim border-border rounded-xl border border-dashed py-10 text-center text-sm">
            Ainda sem avaliações.
          </p>
        ) : (
          <div className="space-y-3">
            {reviewsWithGames.map(({ review, game }) => (
              <ReviewCard
                key={`${review.userId}-${game.slug}`}
                gameSlug={game.slug}
                title={game.title}
                score={review.score}
                content={review.content}
                coverUrl={game.coverUrl}
                createdAt={review.createdAt}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
