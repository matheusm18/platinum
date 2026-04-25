"use client";

export default function GamesError({
  unstable_retry,
}: {
  error: Error;
  unstable_retry: () => void;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24 flex flex-col items-center gap-4 text-center">
      <p className="text-silver-dim text-sm">
        A API de jogos está temporariamente indisponível.
      </p>
      <button
        onClick={unstable_retry}
        className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-silver hover:bg-white/10 transition-colors border border-white/6"
      >
        Tentar novamente
      </button>
    </div>
  );
}