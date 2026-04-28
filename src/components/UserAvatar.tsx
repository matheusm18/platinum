import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "rounded-full flex items-center justify-center shrink-0 select-none overflow-hidden relative border transition-colors",
  {
    variants: {
      size: {
        xs: "w-6 h-6",
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-20 h-20",
        xl: "w-32 h-32",
      },
      variant: {
        purple: "bg-purple/10 border-purple/20",
        gray: "bg-zinc-800 border-border",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "purple",
    },
  },
);

interface UserAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
  username: string;
  avatarUrl: string | null;
}

export function UserAvatar({
  username,
  avatarUrl,
  size,
  variant,
  className,
  ...props
}: UserAvatarProps) {
  const isLocalBlob = avatarUrl?.startsWith("blob:") || avatarUrl?.startsWith("data:");

  const textSize = size === "xs" || size === "sm" ? "text-[10px]" : "text-2xl";

  return (
    <div className={cn(avatarVariants({ size, variant }), className)} {...props}>
      {avatarUrl ? (
        isLocalBlob ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
        ) : (
          <Image
            src={avatarUrl}
            alt={username}
            fill
            sizes="(max-width: 768px) 100vw, 80px"
            className="object-cover"
            unoptimized
          />
        )
      ) : (
        <span className={cn("text-purple-light font-bold uppercase", textSize)}>{username[0]}</span>
      )}
    </div>
  );
}
