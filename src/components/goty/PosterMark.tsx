import { cn } from "@/lib/utils";
import type { GotyNominee } from "@/lib/goty-data";

type Props = {
  nominee: GotyNominee;
  small?: boolean;
};

export function PosterMark({ nominee, small = false }: Props) {
  const initials = nominee.title
    .split(/[\s:]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join("");

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        small ? "h-13 w-10 shrink-0 rounded border border-white/10" : "h-full w-full",
      )}
      style={{
        background: `linear-gradient(145deg, ${nominee.accent} 0%, #111118 54%, #050507 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.20)_45%,transparent_46%),radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.18),transparent_26%)]" />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/20 to-transparent" />
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center font-black tracking-tight text-black/30",
          small ? "text-base" : "text-5xl sm:text-6xl",
        )}
      >
        {initials}
      </div>
      {nominee.officialWinner ? (
        <div className="absolute top-2 left-2 rounded-full bg-black/50 px-2 py-1 text-[9px] font-black tracking-wider text-[#d7b46a] uppercase backdrop-blur">
          Winner
        </div>
      ) : null}
    </div>
  );
}
