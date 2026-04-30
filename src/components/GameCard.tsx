import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/ui/ScoreBadge";
import { rawgResize } from "@/lib/utils";
import type { Game } from "@/types";

type Props = {
  game: Game;
};

export function GameCard({ game }: Props) {
  return (
    <Link href={`/games/${game.slug}`} className="group flex h-full flex-col">
      <div className="bg-bg-card border-border group-hover:border-purple flex h-full flex-col overflow-hidden rounded-lg border transition-colors">
        <div className="relative aspect-video w-full">
          {game.coverUrl ? (
            <Image
              src={rawgResize(game.coverUrl, 640)}
              alt={`Capa de ${game.title}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-zinc-800 to-zinc-900">
              <div className="absolute inset-0 backdrop-blur-sm" />
              <span className="text-silver/70 relative z-10 line-clamp-3 px-4 text-center text-sm font-semibold">
                {game.title}
              </span>
            </div>
          )}
          {game.averageScore !== null && (
            <div className="absolute top-2 right-2">
              <ScoreBadge
                score={game.averageScore}
                className="rounded px-2 py-0.5 font-mono font-bold"
              />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <h3 className="text-silver line-clamp-2 text-sm leading-tight font-semibold transition-colors group-hover:text-white">
            {game.title}
          </h3>
          {game.releaseYear !== null && (
            <p className="text-silver-dim text-xs">{game.releaseYear}</p>
          )}
          <div className="flex flex-wrap gap-x-1 gap-y-1.5">
            {(game.genres ?? []).map((genre) => (
              <Badge key={genre} className="px-1.5 py-0 text-xs">
                {genre}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
