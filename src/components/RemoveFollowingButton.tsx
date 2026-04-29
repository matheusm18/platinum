"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { removeFollowing } from "@/lib/actions/followers";

interface Props {
  followingId: string;
  username: string;
}

export function RemoveFollowingButton({ followingId, username }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await removeFollowing(followingId, username);
        toast.success("Deixaste de seguir");
      } catch {
        toast.error("Erro ao deixar de seguir");
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
      {isPending ? "A remover…" : "Deixar de seguir"}
    </Button>
  );
}
