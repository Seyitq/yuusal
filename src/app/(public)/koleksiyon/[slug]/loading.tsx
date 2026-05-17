// Koleksiyon sayfası skeleton
function SkeletonBox({ className }: { className?: string }) {
  return <div className={`bg-cream-200 animate-pulse rounded ${className ?? ""}`} />;
}

export default function KoleksiyonLoading() {
  return (
    <div>
      {/* Hero banner skeleton */}
      <SkeletonBox className="w-full aspect-[21/7]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <SkeletonBox className="aspect-[3/4] w-full mb-3" />
              <SkeletonBox className="h-4 w-3/4 mb-2" />
              <SkeletonBox className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
