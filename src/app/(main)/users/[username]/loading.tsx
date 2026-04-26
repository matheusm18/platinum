export default function ProfileLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-start gap-6 mb-12">
        <div className="w-20 h-20 rounded-full bg-bg-card border border-border animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-7 w-36 rounded-md bg-bg-card animate-pulse" />
          <div className="h-4 w-48 rounded-md bg-bg-card animate-pulse" />
          <div className="h-4 w-64 rounded-md bg-bg-card animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-lg bg-bg-card border border-border animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 bg-bg-card border border-border rounded-xl p-4">
            <div className="w-20 h-28 rounded-md bg-border animate-pulse shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-5 w-48 rounded bg-border animate-pulse" />
              <div className="h-4 w-full rounded bg-border animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-border animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
