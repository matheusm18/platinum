import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { fetchGame } from "@/lib/rawg";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { RateForm } from "@/components/RateForm";
import { saveReview, deleteReview } from "@/lib/actions/reviews";
import { ScoreBadge } from "@/components/ui/ScoreBadge";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await fetchGame(slug);
  return {
    title: `${game.title} — Platinum`,
    description: game.description.slice(0, 160),
  };
}

export default async function GamePage({ params }: Props) {
  const { slug } = await params;

  const [game, session] = await Promise.all([fetchGame(slug), getSession()]);

  const existingReview = session?.user?.id
    ? await db.select().from(reviews).where(and(eq(reviews.userId, session.user.id), eq(reviews.gameSlug, slug))).limit(1).then((r) => r[0] ?? null)
    : null;

  const boundSaveReview = saveReview.bind(null, slug);
  const boundDeleteReview = deleteReview.bind(null, slug);

  return (
    <div>
      <div className="relative h-72 w-full bg-bg-card">
        {game.coverUrl && (
          <Image
            src={game.coverUrl}
            alt={game.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 pb-6 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">{game.title}</h1>
            <p className="mt-2 text-silver-dim">{game.releaseYear}</p>
            <div className="flex flex-wrap mt-2 gap-2">
              {game.genres.map((genre) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>
          </div>
          {game.averageScore !== null && (
            <ScoreCircle score={game.averageScore} />
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {game.description && (
          <div>
            <h2 className="text-lg font-semibold text-silver mb-2">Sobre</h2>

            <p className="text-silver-dim leading-relaxed">
              {game.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-border pt-6">
          <MetaItem label="Desenvolvedora" values={game.developers} />
          <MetaItem label="Publicadora" values={game.publishers} />
          <MetaItem label="Plataformas" values={game.platforms.slice(0, 4)} />
          {game.playtime ? (
            <MetaItem label="Tempo médio" values={[`${game.playtime}h`]} />
          ) : null}
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

function ScoreCircle({ score }: { score: number }) {
  return <ScoreBadge score={score} className="w-16 h-16 rounded-full text-xl px-0 py-0" />;
}

function MetaItem({ label, values }: { label: string; values: string[] }) {
  if (values.length === 0) return null;
  return (
    <div>
      <p className="text-xs text-silver-dim uppercase tracking-wide mb-1">{label}</p>
      {values.map((v) => (
        <p key={v} className="text-sm text-silver">{v}</p>
      ))}
    </div>
  );
}