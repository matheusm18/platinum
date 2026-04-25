type Props = {
  username: string;
  avatarUrl: string | null;
  className?: string;
};

export function UserAvatar({ username, avatarUrl, className = "w-20 h-20" }: Props) {
  return (
    <div className={`${className} rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0 select-none overflow-hidden relative`}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl font-bold text-purple-light">
          {username[0].toUpperCase()}
        </span>
      )}
    </div>
  );
}