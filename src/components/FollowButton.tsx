"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { followUser, unfollowUser } from "@/lib/actions/follow";

interface Props {
  followingId: string;
  profileUsername: string;
  isFollowing: boolean;
}

export function FollowButton({ followingId, profileUsername, isFollowing }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        if (isFollowing) {
          await unfollowUser(followingId, profileUsername);
          toast.success("Deixaste de seguir " + profileUsername);
        } else {
          await followUser(followingId, profileUsername);
          toast.success("Estás agora a seguir " + profileUsername);
        }
      } catch {
        toast.error("Algo correu mal");
      }
    });
  }

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      className={isFollowing ? "border-border bg-bg-card hover:bg-bg mt-3" : "mt-3"}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "…" : isFollowing ? "Seguindo" : "Seguir"}
    </Button>
  );
}
