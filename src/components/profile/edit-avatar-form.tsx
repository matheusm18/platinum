"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  username: string;
  avatarUrl: string | null;
}

export function EditAvatarForm({ username, avatarUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setError(null);

    const formData = new FormData();
    formData.append("avatar", file);

    startTransition(async () => {
      const res = await fetch("/api/upload/avatar", { method: "POST", body: formData });
      if (res.ok) {
        router.refresh();
      } else {
        const { error } = await res.json();
        setError(error ?? "Erro ao fazer upload");
        setPreview(null);
      }
      URL.revokeObjectURL(localUrl);
    });
  }

  const src = preview ?? avatarUrl;

  return (
    <div className="flex items-center gap-5">
      <div className="w-20 h-20 rounded-full bg-purple/10 border border-purple/20 overflow-hidden flex items-center justify-center shrink-0 select-none">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={username} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-purple-light">{username[0].toUpperCase()}</span>
        )}
      </div>

      <div>
        <Button
          variant="ghost"
          size="sm"
          className="text-silver-dim hover:text-silver hover:bg-bg"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-silver-dim/30 border-t-silver-dim rounded-full animate-spin" />
              A carregar...
            </>
          ) : (
            <>
              <Camera size={14} />
              Alterar foto
            </>
          )}
        </Button>
        <p className="text-xs text-silver-dim/50 mt-1.5 pl-1">JPG, PNG ou WebP · máx. 5 MB</p>
        {error && <p className="text-xs text-red-400 mt-2 pl-1">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}