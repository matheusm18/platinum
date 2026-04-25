import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import type { Game } from "@/types";

type Props = {
  game: Game;
};

export function GameCard({ game }: Props) {
  return (
    <Link href={`/games/${game.slug}`} className="group flex flex-col h-full">
      <div className="flex flex-col h-full rounded-lg overflow-hidden bg-bg-card border border-border transition-colors group-hover:border-purple">
        <div className="relative aspect-video w-full">
          {game.coverUrl ? (
            <Image
              src={game.coverUrl}
              alt={`Capa de ${game.title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-900">
              <div className="absolute inset-0 backdrop-blur-sm" />
              <span className="relative z-10 px-4 text-center text-sm font-semibold text-silver/70 line-clamp-3">
                {game.title}
              </span>
            </div>
          )}
          {game.averageScore !== null && (
            <div className="absolute top-2 right-2">
              <ScoreBadge score={game.averageScore} className="font-mono font-bold px-2 py-0.5 rounded" />
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-3 gap-1.5">
          <h3 className="text-sm font-semibold text-silver leading-tight line-clamp-2 group-hover:text-white transition-colors">
            {game.title}
          </h3>
          <p className="text-xs text-silver-dim">{game.releaseYear}</p>
          <div className="flex flex-wrap gap-x-1 gap-y-1.5">
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