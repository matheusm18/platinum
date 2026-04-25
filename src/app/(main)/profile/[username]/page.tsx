import { notFound } from "next/navigation";
import { eq, asc, desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, reviews, favorites } from "@/db/schema";
import { fetchGame } from "@/lib/rawg";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${username} — Platinum` };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const session = await auth();
  const isOwner = session?.user?.name === username;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) notFound();

  const [userReviews, userFavorites] = await Promise.all([
    db.select().from(reviews).where(eq(reviews.userId, user.id)).orderBy(desc(reviews.createdAt)).limit(20),
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

  const joinedDate = user.createdAt.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center gap-6 mb-12">
        <AvatarUpload username={user.username} avatarUrl={user.avatarUrl} />

        <div className="flex-1 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">@{user.username}</h1>
            <p className="text-silver-dim text-sm mt-1">Membro desde {joinedDate}</p>
            <div className="flex gap-6 mt-3">
              <div>
                <span className="font-semibold text-white">{userReviews.length}</span>
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
                <Link href={`/profile/${user.username}/edit`}>Editar perfil</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-xs font-semibold text-silver-dim uppercase tracking-widest mb-4">Jogos favoritos</h2>
        <div className="flex gap-3">
          {Array.from({ length: 5 }, (_, i) => {
            const fav = userFavorites.find((f) => f.rank === i + 1);
            const game = fav ? gameMap.get(fav.gameSlug) : undefined;
            return (
              <div
                key={i}
                className="flex-1 aspect-2/3 rounded-lg overflow-hidden bg-bg-card border border-border relative group"
              >
                {fav && game ? (
                  <Link href={`/games/${fav.gameSlug}`} className="block w-full h-full">
                    <Image
                      src={game.coverUrl}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </Link>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-border text-xl font-bold">{i + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-silver-dim uppercase tracking-widest mb-4">Avaliações recentes</h2>
        {userReviews.length === 0 ? (
          <p className="text-silver-dim text-sm py-10 text-center border border-dashed border-border rounded-xl">
            Ainda sem avaliações.
          </p>
        ) : (
          <div className="space-y-3">
            {userReviews.map((review) => {
              const game = gameMap.get(review.gameSlug);
              return (
                <div key={review.id} className="flex gap-4 bg-bg-card border border-border rounded-xl p-4 items-stretch transition-all hover:border-silver/20">
                  <Link href={`/games/${review.gameSlug}`} className="shrink-0">
                    <div className="w-20 h-28 rounded-md overflow-hidden bg-bg border border-border relative">
                      {game && (
                        <Image src={game.coverUrl} alt={game.title} fill className="object-cover" />
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
                        <ScoreBadge score={review.score} />
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

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
    score >= 75 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
    score >= 50 ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                  "bg-red-500/10 text-red-400 border-red-500/20";
  return (
    <span className={`shrink-0 text-lg font-bold px-2 py-0.5 rounded border ${color}`}>
      {score}
    </span>
  );
}