export default function Loading() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="max-w-3xl space-y-4 mb-12">
        <div className="h-5 w-32 rounded-full bg-primary/10 border border-primary/20" />
        <div className="h-10 sm:h-12 w-3/4 rounded-2xl bg-muted/60" />
        <div className="h-4 w-5/6 rounded-lg bg-muted/40" />
        <div className="h-4 w-2/3 rounded-lg bg-muted/30" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl border border-border/50 bg-card/60 p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10" />
              <div className="h-6 w-1/2 rounded-lg bg-muted/60" />
              <div className="h-4 w-full rounded bg-muted/40" />
              <div className="h-4 w-4/5 rounded bg-muted/30" />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border/30">
              <div className="h-5 w-20 rounded bg-muted/50" />
              <div className="h-8 w-24 rounded-lg bg-primary/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
