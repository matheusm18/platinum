"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { favoriteGame, unfavoriteGame } from "@/lib/actions/favorites";

interface Props {
  gameSlug: string;
  gameTitle: string;
  isFavorite: boolean;
}

export function FavoriteButton({ gameSlug, gameTitle, isFavorite }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        if (isFavorite) {
          await unfavoriteGame(gameSlug);
          toast.success(`Removido dos favoritos: ${gameTitle}`);
        } else {
          await favoriteGame(gameSlug);
          toast.success(`Adicionado aos favoritos: ${gameTitle}`);
        }
      } catch {
        toast.error("Algo correu mal");
      }
    });
  }

  return (
    <Button
      size="sm"
      variant={isFavorite ? "ghost" : "ghost"}
      className={isFavorite ? "border-border bg-bg-card hover:bg-bg mt-3" : "mt-3"}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "…" : isFavorite ? "Favorito" : "Favoritar"}
    </Button>
  );
}
