"use client";

import { useTransition } from "react";
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
      if (isFollowing) {
        await unfollowUser(followingId, profileUsername);
      } else {
        await followUser(followingId, profileUsername);
      }
    });
  }

  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "default"}
      className={isFollowing ? "mt-3 border-border bg-bg-card hover:bg-bg" : "mt-3"}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "…" : isFollowing ? "Seguindo" : "Seguir"}
    </Button>
  );
}