import { notFound, redirect } from "next/navigation";
import { eq, asc, desc, sql } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { users, reviews, favorites } from "@/db/schema";
import { fetchGame } from "@/lib/rawg";
import { rawgResize } from "@/lib/utils";
import { UserAvatar } from "@/components/UserAvatar";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { SlotPicker, type Slot } from "@/components/SlotPicker";
import { updateFavorite, searchGamesAction } from "@/lib/actions/favorites";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username} — Platinum` };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const [[user], session] = await Promise.all([
    db
      .select({
        id: users.id,
        username: users.username,
        avatarUrl: users.avatarUrl,
        bio: users.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(sql`lower(${users.username})`, username.toLowerCase()))
      .limit(1),
    getSession(),
  ]);

  if (!user) notFound();
  if (username !== user.username) redirect(`/users/${user.username}`);

  const isOwner = session?.user?.id === user.id;

  const [userReviews, [{ totalReviews }], userFavorites] = await Promise.all([
    db.select().from(reviews).where(eq(reviews.userId, user.id)).orderBy(desc(reviews.updatedAt)).limit(20),
    db.select({ totalReviews: sql<number>`count(*)` }).from(reviews).where(eq(reviews.userId, user.id)),
    db.select().from(favorites).where(eq(favorites.userId, user.id)).orderBy(asc(favorites.rank)),
  ]);

  const allSlugs = [...new Set([
    ...userFavorites.map((f) => f.gameSlug),
    ...userReviews.map((r) => r.gameSlug),
  ])];

  const gameEntries = await Promise.all(
    allSlugs.map(async (slug) => {
      try {
        const g = await fetchGame(slug);
        return [slug, { title: g.title, coverUrl: g.coverUrl }] as const;
      } catch {
        return [slug, null] as const;
      }
    })
  );
  const gameMap = new Map(
    gameEntries.filter((e): e is [string, { title: string; coverUrl: string }] => e[1] !== null)
  );

  const favoriteSlots: Slot[] = Array.from({ length: 5 }, (_, i) => {
    const rank = i + 1;
    const fav = userFavorites.find((f) => f.rank === rank);
    const game = fav ? gameMap.get(fav.gameSlug) : undefined;
    return {
      rank,
      slug: fav?.gameSlug ?? null,
      title: game?.title ?? null,
      coverUrl: game?.coverUrl ?? null,
    };
  });

  const joinedDate = user.createdAt.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-start gap-6 mb-12">
        <UserAvatar username={user.username} avatarUrl={user.avatarUrl} />

        <div className="flex-1 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">@{user.username}</h1>
            <p className="text-silver-dim text-sm mt-1">Membro desde {joinedDate}</p>
            {user.bio && <p className="text-silver text-sm mt-1 max-w-sm">{user.bio}</p>}
            <div className="flex gap-6 mt-3">
              <div>
                <span className="font-semibold text-white">{totalReviews}</span>
                <span className="text-silver-dim text-sm ml-1.5">avaliações</span>
              </div>
              <div>
                <span className="font-semibold text-white">{userFavorites.length}</span>
                <span className="text-silver-dim text-sm ml-1.5">favoritos</span>
              </div>
            </div>
          </div>
          <div>
            {isOwner && (
              <Button asChild size="sm" variant="outline" className="mt-3 border-border bg-bg-card hover:bg-bg">
                <Link href={`/users/${user.username}/edit`}>Editar perfil</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <SlotPicker
        slots={favoriteSlots}
        isOwner={isOwner}
        label="Jogos favoritos"
        hrefPrefix="/games/"
        onSave={updateFavorite}
        onSearch={searchGamesAction}
      />

      <section>
        <h2 className="text-xs font-semibold text-silver-dim uppercase tracking-widest mb-4">Avaliações recentes</h2>
        {userReviews.length === 0 ? (
          <p className="text-silver-dim text-sm py-10 text-center border border-dashed border-border rounded-xl">
            Ainda sem avaliações.
          </p>
        ) : (
          <div className="space-y-3">
            {userReviews.slice(0,20).map((review) => {
              const game = gameMap.get(review.gameSlug);
              return (
                <div key={review.id} className="flex gap-4 bg-bg-card border border-border rounded-xl p-4 items-stretch transition-all hover:border-silver/20">
                  <Link href={`/games/${review.gameSlug}`} className="shrink-0">
                    <div className="w-20 h-28 rounded-md overflow-hidden bg-bg border border-border relative">
                      {game && (
                        <Image src={rawgResize(game.coverUrl, 420)} alt={game.title} fill sizes="80px" className="object-cover" unoptimized />
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <Link
                          href={`/games/${review.gameSlug}`}
                          className="font-bold text-white hover:text-silver transition-colors text-xl leading-tight"
                        >
                          {game?.title ?? review.gameSlug}
                        </Link>
                        <ScoreBadge score={review.score * 10} normalized={true} className="shrink-0 text-lg font-mono font-bold px-2 py-0.5 rounded"/>
                      </div>

                      {review.content && (
                        <p className="text-silver-dim text-sm leading-relaxed pr-12"> 
                          {review.content}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end mt-4">
                      <p className="text-xs uppercase tracking-widest text-silver-dim opacity-40">
                        {review.createdAt.toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}