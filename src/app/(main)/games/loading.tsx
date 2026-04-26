export default function GamesLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="h-8 w-32 rounded-md bg-bg-card animate-pulse mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="flex flex-col rounded-lg overflow-hidden bg-bg-card border border-border">
            <div className="aspect-video w-full bg-border animate-pulse" />
            <div className="p-3 space-y-2">
              <div className="h-4 w-full rounded bg-border animate-pulse" />
              <div className="h-3 w-16 rounded bg-border animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
