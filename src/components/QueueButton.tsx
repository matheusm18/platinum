"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addToQueue, removeFromQueue } from "@/lib/actions/playQueue";

interface Props {
  gameSlug: string;
  gameTitle: string;
  isQueued: boolean;
}

export function QueueButton({ gameSlug, gameTitle, isQueued }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        if (isQueued) {
          await removeFromQueue(gameSlug);
          toast.success(`Removido da fila: ${gameTitle}`);
        } else {
          await addToQueue(gameSlug);
          toast.success(`Adicionado à fila: ${gameTitle}`);
        }
      } catch {
        toast.error("Algo correu mal");
      }
    });
  }

  return (
    <Button
      size="sm"
      variant={isQueued ? "ghost" : "ghost"}
      className={isQueued ? "border-border bg-bg-card hover:bg-bg mt-3" : "mt-3"}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "…" : isQueued ? "Na fila" : "Adicionar à fila"}
    </Button>
  );
}
