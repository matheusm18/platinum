import Image from "next/image";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, resizeCover } from "@/lib/utils";
import { ScoreBadge } from "@/components/ui/ScoreBadge";

const cardVariants = cva(
  "flex flex-col sm:flex-row gap-4 bg-bg-card border border-border rounded-xl p-4 items-stretch transition-all hover:border-silver/20",
  {
    variants: {
      size: {
        default: "",
        lg: "p-6 gap-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const imageVariants = cva(
  "shrink-0 rounded-md overflow-hidden bg-bg border border-border relative w-full h-48 sm:h-28 sm:w-20",
  {
    variants: {
      size: {
        default: "",
        lg: "sm:w-32 sm:h-44 h-64",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface ReviewCardProps extends VariantProps<typeof cardVariants> {
  gameSlug: string;
  title: string;
  score: number;
  content: string | null;
  coverUrl: string;
  createdAt?: Date;
  className?: string;
}

export function ReviewCard({
  gameSlug,
  title,
  score,
  content,
  coverUrl,
  createdAt,
  size,
  className,
}: ReviewCardProps) {
  const isLarge = size === "lg";

  return (
    <div className={cn(cardVariants({ size }), className)}>
      <Link href={`/games/${gameSlug}`} className={imageVariants({ size })}>
        <Image
          src={resizeCover(coverUrl, 420)}
          alt={title}
          fill
          sizes={isLarge ? "128px" : "30px"}
          className="object-cover"
          unoptimized
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="mb-2 flex flex-col items-start justify-between gap-2 sm:flex-row sm:gap-4">
            <Link
              href={`/games/${gameSlug}`}
              className={cn(
                "hover:text-silver leading-tight font-bold text-white transition-colors",
                isLarge ? "text-2xl" : "text-xl",
              )}
            >
              {title}
            </Link>

            <ScoreBadge
              score={score * 10}
              normalized={true}
              className={cn(
                "shrink-0 rounded px-2 py-0.5 font-mono font-bold",
                isLarge ? "text-xl" : "text-lg",
              )}
            />
          </div>

          {content && (
            <p
              className={cn(
                "text-silver-dim line-clamp-4 leading-relaxed sm:line-clamp-5",
                isLarge ? "text-base" : "text-sm",
              )}
            >
              {content}
            </p>
          )}
        </div>

        {createdAt && (
          <div className="mt-4 flex justify-end">
            <p className="text-silver-dim text-xs tracking-widest uppercase opacity-40">
              {createdAt.toLocaleDateString("pt-PT", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
