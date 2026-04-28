export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 flex items-start gap-6">
        <div className="bg-bg-card border-border h-20 w-20 shrink-0 animate-pulse rounded-full border" />
        <div className="flex-1 space-y-2">
          <div className="bg-bg-card h-7 w-36 animate-pulse rounded-md" />
          <div className="bg-bg-card h-4 w-48 animate-pulse rounded-md" />
          <div className="bg-bg-card h-4 w-64 animate-pulse rounded-md" />
        </div>
      </div>
      <div className="mb-10 grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-bg-card border-border aspect-3/4 animate-pulse rounded-lg border"
          />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-bg-card border-border flex gap-4 rounded-xl border p-4">
            <div className="bg-border h-28 w-20 shrink-0 animate-pulse rounded-md" />
            <div className="flex-1 space-y-2 py-1">
              <div className="bg-border h-5 w-48 animate-pulse rounded" />
              <div className="bg-border h-4 w-full animate-pulse rounded" />
              <div className="bg-border h-4 w-3/4 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
