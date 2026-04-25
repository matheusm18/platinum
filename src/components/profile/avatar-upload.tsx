interface AvatarUploadProps {
  username: string;
  avatarUrl: string | null;
}

export function AvatarUpload({ username, avatarUrl }: AvatarUploadProps) {
  const src = avatarUrl;

  return (
    <div className="w-20 h-20 rounded-full bg-purple/10 border border-purple/20 flex items-center justify-center shrink-0 select-none overflow-hidden relative">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={username} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl font-bold text-purple-light">{username[0].toUpperCase()}</span>
      )}
    </div>
  );
}