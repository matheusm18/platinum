import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import type { GotyNominee } from "@/lib/goty-data";
import { resizeCover } from "@/lib/utils";
import { PosterMark } from "@/components/goty/PosterMark";

type Props = {
  position: number;
  nominee?: GotyNominee | null;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

export function RankingSlot({
  position,
  nominee,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
}: Props) {
  return (
    <div className="group border-border bg-bg relative aspect-2/3 overflow-hidden rounded-lg border">
      {nominee ? (
        <>
          <Link href={`/games/${nominee.slug}`} className="absolute inset-0">
            {nominee.coverUrl ? (
              <Image
                src={resizeCover(nominee.coverUrl, 640)}
                alt={nominee.title}
                fill
                sizes="(max-width: 768px) 50vw, 150px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                unoptimized
              />
            ) : (
              <PosterMark nominee={nominee} />
            )}
            <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/55 px-3 py-3 backdrop-blur-md">
              <p className="text-[10px] font-black tracking-widest text-white/45 uppercase">
                #{position}
              </p>
              <p className="mt-1 line-clamp-2 text-sm leading-tight font-black text-white">
                {nominee.title}
              </p>
            </div>
          </Link>

          <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-black/65 text-white/80 backdrop-blur disabled:opacity-25"
              aria-label="Subir no ranking"
            >
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-black/65 text-white/80 backdrop-blur disabled:opacity-25"
              aria-label="Descer no ranking"
            >
              <ArrowDown size={14} />
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-black/65 text-white/80 backdrop-blur"
              aria-label="Remover do ranking"
            >
              <X size={14} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <span className="text-border text-4xl font-black">#{position}</span>
          <span className="text-silver-dim text-xs">Slot livre</span>
        </div>
      )}
    </div>
  );
}
