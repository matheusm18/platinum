import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { fetchGame } from "@/lib/rawg";
import type { Metadata } from "next";

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

  const game = await fetchGame(slug);

  return (
    <div>
      <div className="relative h-72 w-full bg-bg-card">
        {game.coverUrl && (
          <Image
            src={game.coverUrl}
            alt={game.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-4 pb-6 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">{game.title}</h1>
            <p className="mt-1 text-silver-dim">{game.releaseYear}</p>
          </div>
          {game.averageScore !== null && (
            <ScoreCircle score={game.averageScore} />
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-wrap gap-2">
          {game.genres.map((genre) => (
            <Badge key={genre}>{genre}</Badge>
          ))}
        </div>

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
      </div>
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 90 ? "border-emerald-500 text-emerald-400" :
    score >= 75 ? "border-yellow-500 text-yellow-400" :
                  "border-red-500 text-red-400";

  return (
    <div className={`w-16 h-16 rounded-full border-4 ${color} flex items-center justify-center`}>
      <span className="text-xl font-bold">{score}</span>
    </div>
  );
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