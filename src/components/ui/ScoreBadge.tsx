import { cn } from "@/lib/utils";

type Props = {
  score: number;
  normalized?: boolean;
  className?: string;
};

export function ScoreBadge({ score, normalized, className }: Props) {
  const color =
    score > 90 ? "bg-green-700" :
    score > 80 ? "bg-green-500" :
    score > 60 ? "bg-orange-400" :
    score > 40 ? "bg-yellow-400" :
                 "bg-red-500";

  return (
    <span className={cn("inline-flex items-center justify-center font-bold rounded text-sm", color, className)}>
      {normalized ? (score/10) : score}
    </span>
  );
}