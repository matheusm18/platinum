import { eq, and, asc } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { favorites, follows, games, users } from "@/db/schema";
import { UserAvatar } from "@/components/UserAvatar";
import { notFound, redirect } from "next/navigation";
import { FollowButton } from "@/components/FollowButton";
import { GameCard } from "@/components/GameCard";

type Props = { params: Promise<{ username: string }> };

export default async function FavoritesPage({ params }: Props) {
  const { username } = await params;
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user) {
    notFound();
  }

  const isOwner = session.user.id === user.id;

  const [favoritesWithGames, followRow] = await Promise.all([
    db
      .select({ fav: favorites, game: games })
      .from(favorites)
      .innerJoin(games, eq(favorites.gameSlug, games.slug))
      .where(eq(favorites.userId, user.id))
      .orderBy(asc(favorites.rank)),
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

            <div className="w-full md:w-auto">
              {!isOwner && session?.user && (
                <FollowButton
                  followingId={user.id}
                  profileUsername={user.username}
                  isFollowing={isFollowing}
                />
              )}
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-3 md:justify-start">
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-white">{favoritesWithGames.length}</span>
                <span className="text-silver-dim ml-1.5 text-sm">jogos favoritos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-silver-dim mb-4 text-xs font-semibold tracking-widest uppercase">
          Jogos favoritos
        </h2>
        <div>
          {favoritesWithGames.length === 0 ? (
            <p className="text-silver-dim">Nenhum jogo favorito encontrado.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favoritesWithGames.map(({ fav, game }) => (
                <GameCard key={`${fav.userId}-${fav.gameSlug}`} game={game} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
