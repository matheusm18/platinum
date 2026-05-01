"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pin, RotateCcw, Save, Share2, Trophy } from "lucide-react";
import type { GotyYear } from "@/lib/goty-data";
import { NomineeList } from "@/components/goty/NomineeList";
import { RankingSlot } from "@/components/goty/RankingSlot";
import { YearSelector } from "@/components/goty/YearSelector";

type Props = {
  years: GotyYear[];
  initialYear: number;
  initialRankings: Record<number, string[]>;
  initialPinnedYears: number[];
  isAuthenticated: boolean;
  onSave: (year: number, ranking: Array<string | null>, isPinned: boolean) => Promise<void>;
};

const slotCount = 5;

export function GotyBoard({
  years,
  initialYear,
  initialRankings,
  initialPinnedYears,
  isAuthenticated,
  onSave,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [pinnedYears, setPinnedYears] = useState<Set<number>>(() => new Set(initialPinnedYears));
  const activeYear = useMemo(
    () => years.find((year) => year.year === selectedYear) ?? years[0],
    [selectedYear, years],
  );
  const [rankings, setRankings] = useState<Record<number, Array<string | null>>>(() =>
    Object.fromEntries(
      years.map((year) => [
        year.year,
        Array.from(
          { length: slotCount },
          (_, index) => initialRankings[year.year]?.[index] ?? year.defaultRanking[index] ?? null,
        ),
      ]),
    ),
  );

  const ranking = rankings[activeYear.year] ?? Array(slotCount).fill(null);
  const nomineeBySlug = new Map(activeYear.nominees.map((nominee) => [nominee.slug, nominee]));
  const usedSlugs = new Set(ranking.filter(Boolean));
  const winner = activeYear.nominees.find((nominee) => nominee.officialWinner);
  const isCurrentYearPinned = pinnedYears.has(activeYear.year);

  function updateRanking(nextRanking: Array<string | null>) {
    setRankings((current) => ({ ...current, [activeYear.year]: nextRanking }));
  }

  function addNominee(slug: string) {
    if (usedSlugs.has(slug)) return;
    const emptyIndex = ranking.findIndex((item) => item === null);
    if (emptyIndex === -1) return;

    const nextRanking = [...ranking];
    nextRanking[emptyIndex] = slug;
    updateRanking(nextRanking);
  }

  function removeNominee(index: number) {
    const nextRanking = [...ranking];
    nextRanking[index] = null;
    updateRanking(nextRanking);
  }

  function moveNominee(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slotCount) return;

    const nextRanking = [...ranking];
    [nextRanking[index], nextRanking[targetIndex]] = [nextRanking[targetIndex], nextRanking[index]];
    updateRanking(nextRanking);
  }

  function resetRanking() {
    updateRanking(
      Array.from({ length: slotCount }, (_, index) => activeYear.defaultRanking[index] ?? null),
    );
  }

  function togglePinnedYear() {
    setPinnedYears((current) => {
      const next = new Set(current);

      if (next.has(activeYear.year)) {
        next.delete(activeYear.year);
      } else {
        next.add(activeYear.year);
      }

      return next;
    });
  }

  function showFeedComingSoon() {
    toast.info("Partilhar GOTY no feed será implementado no futuro.");
  }

  function saveRanking() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      try {
        await onSave(activeYear.year, ranking, isCurrentYearPinned);
        toast.success(
          isCurrentYearPinned
            ? `GOTY ${activeYear.year} guardado e fixado no perfil.`
            : `GOTY ${activeYear.year} guardado.`,
        );
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível guardar";
        toast.error(message);
      }
    });
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(215,180,106,0.16),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(184,57,50,0.13),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 pb-20">
        <section className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <div className="border-border/70 bg-bg-card/45 text-silver-dim inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-widest uppercase">
              <Trophy size={14} className="text-[#d7b46a]" />
              GOTY
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl leading-none font-black tracking-tight text-white sm:text-6xl">
              Monta o teu Top 5 de {activeYear.year}
            </h1>
            <p className="text-silver-dim mt-4 max-w-2xl text-sm leading-6 sm:text-base">
              Escolhe entre os nomeados oficiais, ordena o teu ranking e usa isto como preview do
              card que depois pode aparecer no seu perfil.
            </p>
          </div>

          <YearSelector
            years={years}
            selectedYear={activeYear.year}
            winner={winner}
            onSelectYear={setSelectedYear}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="border-border bg-bg-card/40 rounded-lg border p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-silver-dim text-xs font-semibold tracking-widest uppercase">
                  O teu card GOTY
                </h2>
                <p className="text-silver-dim mt-1 text-sm">{activeYear.tagline}</p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <label className="border-border bg-bg hover:bg-bg-card text-silver inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 text-xs font-semibold transition-colors has-checked:border-[#d7b46a]/55 has-checked:text-[#f1d58b]">
                  <input
                    type="checkbox"
                    checked={isCurrentYearPinned}
                    onChange={togglePinnedYear}
                    className="peer sr-only"
                  />
                  <span className="border-silver-dim/60 flex h-4 w-4 items-center justify-center rounded border transition-colors peer-checked:border-[#d7b46a] peer-checked:bg-[#d7b46a]">
                    <Pin size={10} className={isCurrentYearPinned ? "text-bg" : "opacity-0"} />
                  </span>
                  Fixar no perfil
                </label>
                <button
                  type="button"
                  onClick={showFeedComingSoon}
                  className="border-border bg-bg hover:bg-bg-card text-silver inline-flex h-9 items-center gap-2 rounded-md border px-3 text-xs font-semibold transition-colors"
                >
                  <Share2 size={14} />
                  Feed
                </button>
                <button
                  type="button"
                  onClick={saveRanking}
                  disabled={isPending}
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-[#d7b46a]/50 bg-[#d7b46a]/12 px-3 text-xs font-semibold text-[#f1d58b] transition-colors hover:bg-[#d7b46a]/18 disabled:opacity-60"
                >
                  <Save size={14} />
                  {isPending ? "A guardar" : "Guardar"}
                </button>
                <button
                  type="button"
                  onClick={resetRanking}
                  className="border-border bg-bg hover:bg-bg-card text-silver inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors"
                  aria-label="Repor ranking inicial"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {ranking.map((slug, index) => {
                const nominee = slug ? nomineeBySlug.get(slug) : null;

                return (
                  <RankingSlot
                    key={`${activeYear.year}-${index}`}
                    position={index + 1}
                    nominee={nominee}
                    canMoveUp={index > 0}
                    canMoveDown={index < slotCount - 1}
                    onMoveUp={() => moveNominee(index, -1)}
                    onMoveDown={() => moveNominee(index, 1)}
                    onRemove={() => removeNominee(index)}
                  />
                );
              })}
            </div>
          </div>

          <NomineeList nominees={activeYear.nominees} usedSlugs={usedSlugs} onAdd={addNominee} />
        </section>
      </div>
    </div>
  );
}
