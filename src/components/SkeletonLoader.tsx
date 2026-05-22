export function SkeletonLoader({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-video rounded-lg bg-white/10" />
          <div className="mt-3 h-4 rounded bg-white/10" />
          <div className="mt-2 h-3 w-2/3 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}
