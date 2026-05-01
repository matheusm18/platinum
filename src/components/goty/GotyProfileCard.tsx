import Image from "next/image";
import Link from "next/link";
import { Pencil, Trophy } from "lucide-react";
import { getGotyYear } from "@/lib/goty-data";
import { rawgResize } from "@/lib/utils";
import { PosterMark } from "@/components/goty/PosterMark";

type GotyGame = {
  slug: string;
  title: string;
  coverUrl: string;
} | null;

type Props = {
  year: number;
  items: Array<{
    rank: number;
    gameSlug: string;
    game: GotyGame;
  }>;
  isOwner: boolean;
};

export function GotyProfileCard({ year, items, isOwner }: Props) {
  const seedYear = getGotyYear(year);
  const nomineeBySlug = new Map(seedYear.nominees.map((nominee) => [nominee.slug, nominee]));

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-silver-dim flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
            <Trophy size={13} className="text-[#d7b46a]" />
            GOTY {year}
          </h2>
        </div>

        {isOwner ? (
          <Link
            href={`/goty?year=${year}`}
            className="text-silver-dim hover:text-silver flex items-center gap-1 text-xs transition-colors"
          >
            <Pencil size={12} />
            Editar
          </Link>
        ) : null}
      </div>

      <div className="border-border bg-bg-card/30 rounded-lg border p-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {items.map((item) => {
            const nominee = nomineeBySlug.get(item.gameSlug);
            const title = item.game?.title ?? nominee?.title ?? item.gameSlug;

            return (
              <Link
                key={`${item.rank}-${item.gameSlug}`}
                href={`/games/${item.gameSlug}`}
                className="group border-border bg-bg relative aspect-2/3 overflow-hidden rounded-lg border"
              >
                {item.game?.coverUrl ? (
                  <Image
                    src={rawgResize(item.game.coverUrl, 640)}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 50vw, 150px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    unoptimized
                  />
                ) : nominee ? (
                  <PosterMark nominee={nominee} />
                ) : (
                  <div className="bg-bg-card h-full w-full" />
                )}

                <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/55 px-3 py-3 backdrop-blur-md">
                  <p className="text-[10px] font-black tracking-widest text-white/45 uppercase">
                    #{item.rank}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-tight font-black text-white">
                    {title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
