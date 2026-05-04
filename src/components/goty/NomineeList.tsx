import { Check } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { GotyNominee } from "@/lib/goty-data";
import { resizeCover } from "@/lib/utils";
import { PosterMark } from "@/components/goty/PosterMark";

type Props = {
  nominees: GotyNominee[];
  usedSlugs: Set<string | null>;
  onAdd: (slug: string) => void;
};

export function NomineeList({ nominees, usedSlugs, onAdd }: Props) {
  return (
    <aside className="border-border bg-bg-card/40 rounded-lg border p-4 sm:p-5">
      <h2 className="text-silver-dim text-xs font-semibold tracking-widest uppercase">Nomeados</h2>
      <div className="mt-4 space-y-2">
        {nominees.map((nominee) => {
          const isUsed = usedSlugs.has(nominee.slug);

          return (
            <button
              key={nominee.slug}
              type="button"
              onClick={() => onAdd(nominee.slug)}
              disabled={isUsed}
              className={cn(
                "group flex w-full items-center gap-3 rounded-md border p-2 text-left transition-colors",
                isUsed
                  ? "text-silver-dim border-white/10 bg-white/3"
                  : "border-border bg-bg/70 hover:border-white/20 hover:bg-white/4",
              )}
            >
              <div className="relative h-13 w-10 shrink-0 overflow-hidden rounded border border-white/10">
                {nominee.coverUrl ? (
                  <Image
                    src={resizeCover(nominee.coverUrl, 640)}
                    alt={nominee.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <PosterMark nominee={nominee} small />
                )}
              </div>
              <span className="min-w-0 flex-1">
                <span className="text-silver block truncate text-sm font-bold group-hover:text-white">
                  {nominee.title}
                </span>
                <span className="text-silver-dim mt-0.5 block truncate text-xs">
                  {nominee.studio}
                </span>
              </span>
              {isUsed ? (
                <Check size={15} className="text-[#d7b46a]" />
              ) : (
                <span className="text-silver-dim text-xs">Adicionar</span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
