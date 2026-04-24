import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/types";

type Props = {
  game: Game;
};

export function GameCard({ game }: Props) {
  return (
    <Link href={`/games/${game.slug}`} className="group block">
      <div className="rounded-lg overflow-hidden bg-bg-card border border-border transition-colors group-hover:border-purple">
        <div className="relative aspect-video w-full">
          {game.coverUrl && (
            <Image
              src={game.coverUrl}
              alt={`Capa de ${game.title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          )}
          {game.averageScore !== null && (
            <div className="absolute top-2 right-2">
              <ScoreBadge score={game.averageScore} />
            </div>
          )}
        </div>

        <div className="p-3 space-y-1.5">
          <h3 className="text-sm font-semibold text-silver leading-tight line-clamp-2 group-hover:text-white transition-colors">
            {game.title}
          </h3>
          <p className="text-xs text-silver-dim">{game.releaseYear}</p>
          <div className="flex flex-wrap gap-1">
            {game.genres.map((genre) => (
              <Badge key={genre} className="text-xs px-1.5 py-0">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "bg-emerald-500" :
    score >= 75 ? "bg-yellow-500" :
                  "bg-red-500";

  return (
    <span className={`${color} text-white font-mono font-bold px-2 py-0.5 rounded`}>
      {score}
    </span>
  );
}