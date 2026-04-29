"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { removeFollower } from "@/lib/actions/followers";

interface Props {
  followerId: string;
  username: string;
}

export function RemoveFollowerButton({ followerId, username }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await removeFollower(followerId, username);
        toast.success("Seguidor removido");
      } catch {
        toast.error("Erro ao remover seguidor");
      }
    });
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="border-border bg-bg-card hover:bg-bg w-full md:w-auto"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isPending ? "A remover…" : "Remover seguidor"}
    </Button>
  );
}
