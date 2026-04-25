import Link from "next/link";
import { UserAvatar } from "@/components/UserAvatar";
import type { UserPublic } from "@/types";

type Props = {
  user: UserPublic;
};

export function UserCard({ user }: Props) {
  return (
    <Link href={`/users/${user.username}`} className="group flex flex-col h-full">
      <div className="flex flex-col h-full items-center gap-3 rounded-lg bg-bg-card border border-border transition-colors group-hover:border-purple p-5">
        <UserAvatar username={user.username} avatarUrl={user.avatarUrl} className="w-16 h-16" />
        <p className="text-sm font-semibold text-silver group-hover:text-white transition-colors truncate w-full text-center">
          @{user.username}
        </p>
        {user.bio && <p className="text-silver-dim text-xs text-center line-clamp-2 leading-relaxed">{user.bio}</p>}
      </div>
    </Link>
  );
}