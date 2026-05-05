import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { getGameWithMirror } from "@/lib/games";
import { resizeCover } from "@/lib/utils";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { favorites, playQueue, reviews } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { RateForm } from "@/components/RateForm";
import { saveReview, deleteReview } from "@/lib/actions/reviews";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { QueueButton } from "@/components/QueueButton";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameWithMirror(slug);
  return {
    title: `${game.title} — Platinum`,
    description: game.description?.slice(0, 160) ?? `Avaliações de ${game.title}`,
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;

  const [game, session] = await Promise.all([getGameWithMirror(slug), getSession()]);

  const existingReview = session?.user?.id
    ? await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.userId, session.user.id), eq(reviews.gameSlug, slug)))
        .limit(1)
        .then((r) => r[0] ?? null)
    : null;

  const existingFavorite = session?.user?.id
    ? await db
        .select()
        .from(favorites)
        .where(and(eq(favorites.userId, session.user.id), eq(favorites.gameSlug, slug)))
        .limit(1)
        .then((r) => r[0] ?? null)
    : null;

  const existingQueueItem = session?.user?.id
    ? await db
        .select()
        .from(playQueue)
        .where(and(eq(playQueue.userId, session.user.id), eq(playQueue.gameSlug, slug)))
        .limit(1)
        .then((r) => r[0] ?? null)
    : null;

  const boundSaveReview = saveReview.bind(null, slug);
  const boundDeleteReview = deleteReview.bind(null, slug);

  return (
    <div>
      <div className="bg-bg-card relative h-72 w-full">
        {(game.screenshotUrl ?? game.coverUrl) && (
          <Image
            src={game.screenshotUrl ?? resizeCover(game.coverUrl, 1280)}
            alt={game.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            unoptimized
          />
        )}
        <div className="from-bg via-bg/60 absolute inset-0 bg-linear-to-t to-transparent" />

        <div className="absolute right-0 bottom-0 left-0 mx-auto flex max-w-5xl items-end justify-between px-4 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">{game.title}</h1>
            <p className="text-silver-dim mt-2">{game.releaseYear}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {game.genres?.map((genre) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>
            <div className="mt-4 flex gap-4">
              <FavoriteButton
                gameSlug={slug}
                gameTitle={game.title}
                isFavorite={!!existingFavorite}
              />
              <QueueButton gameSlug={slug} gameTitle={game.title} isQueued={!!existingQueueItem} />
            </div>
          </div>
          {game.averageScore !== null && (
            <ScoreBadge
              score={game.averageScore}
              className="h-16 w-16 rounded-full px-0 py-0 text-xl"
            />
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {game.description && (
          <div>
            <h2 className="text-silver mb-2 text-lg font-semibold">Sobre</h2>
            <p className="text-silver-dim leading-relaxed">{game.description}</p>
          </div>
        )}

        <div className="border-border grid grid-cols-2 gap-6 border-t pt-6 sm:grid-cols-4">
          <MetaItem label="Desenvolvedora" values={game.developers ?? []} />
          <MetaItem label="Publicadora" values={game.publishers ?? []} />
          <MetaItem label="Plataformas" values={game.platforms?.slice(0, 4) ?? []} />
          {game.playtime ? <MetaItem label="Tempo médio" values={[`${game.playtime}h`]} /> : null}
        </div>

        {session?.user && (
          <RateForm
            onSave={boundSaveReview}
            onDelete={existingReview ? boundDeleteReview : undefined}
            existingScore={existingReview ? existingReview.score / 2 : null}
            existingContent={existingReview?.content}
          />
        )}
      </div>
    </div>
  );
}

function MetaItem({ label, values }: { label: string; values: string[] }) {
  if (!values || values.length === 0) return null;
  return (
    <div>
      <p className="text-silver-dim mb-1 text-xs tracking-wide uppercase">{label}</p>
      {values.map((v) => (
        <p key={v} className="text-silver text-sm">
          {v}
        </p>
      ))}
    </div>
  );
}
