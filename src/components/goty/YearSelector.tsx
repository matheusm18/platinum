import { cn } from "@/lib/utils";
import type { GotyNominee, GotyYear } from "@/lib/goty-data";

type Props = {
  years: GotyYear[];
  selectedYear: number;
  winner?: GotyNominee;
  onSelectYear: (year: number) => void;
};

const recentYearCount = 4;

export function YearSelector({ years, selectedYear, winner, onSelectYear }: Props) {
  const recentYears = years.slice(0, recentYearCount);
  const archivedYears = years.slice(recentYearCount);

  return (
    <div className="border-border bg-bg-card/55 rounded-lg border p-4 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-silver-dim text-xs font-semibold tracking-widest uppercase">Ano</p>
          <p className="mt-1 text-lg font-bold text-white">The Game Awards</p>
          <p className="text-silver-dim mt-0.5 text-xs">{years.length} anos carregados</p>
        </div>
        {winner ? (
          <div className="text-right">
            <p className="text-silver-dim text-xs font-semibold tracking-widest uppercase">
              Vencedor
            </p>
            <p className="mt-1 max-w-40 truncate text-sm font-semibold text-[#d7b46a]">
              {winner.title}
            </p>
          </div>
        ) : null}
      </div>

      <div className="border-border/60 mt-4 grid grid-cols-2 gap-2 border-t pt-4">
        {recentYears.map((year) => (
          <YearButton
            key={year.year}
            year={year}
            selected={year.year === selectedYear}
            onSelectYear={onSelectYear}
          />
        ))}
      </div>

      {archivedYears.length > 0 ? (
        <div className="mt-4">
          <p className="text-silver-dim mb-2 text-[10px] font-semibold tracking-widest uppercase">
            Outros anos
          </p>
          <div className="grid max-h-28 grid-cols-2 gap-2 overflow-y-auto pr-1">
            {archivedYears.map((year) => (
              <YearButton
                key={year.year}
                year={year}
                selected={year.year === selectedYear}
                compact
                onSelectYear={onSelectYear}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function YearButton({
  year,
  selected,
  compact = false,
  onSelectYear,
}: {
  year: GotyYear;
  selected: boolean;
  compact?: boolean;
  onSelectYear: (year: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectYear(year.year)}
      className={cn(
        "rounded-md border text-left transition-colors",
        compact ? "px-3 py-2" : "px-3 py-2.5",
        selected
          ? "border-[#d7b46a]/70 bg-[#d7b46a]/10 text-white"
          : "border-border bg-bg/70 text-silver-dim hover:text-silver hover:border-white/20",
      )}
    >
      <span className={cn("block font-black", compact ? "text-sm" : "text-base")}>{year.year}</span>
      <span className="mt-0.5 block truncate text-[11px]">{year.nominees.length} nomeados</span>
    </button>
  );
}
