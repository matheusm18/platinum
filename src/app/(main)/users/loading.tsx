export default function UsersLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="h-8 w-24 rounded-md bg-bg-card animate-pulse" />
        <div className="h-4 w-40 rounded-md bg-bg-card animate-pulse mt-2" />
      </div>
      <div className="mb-4 h-10 rounded-md bg-bg-card animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3 rounded-lg bg-bg-card border border-border p-5">
            <div className="w-16 h-16 rounded-full bg-border animate-pulse" />
            <div className="h-4 w-28 rounded bg-border animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
