// Kategori sayfası skeleton
function SkeletonBox({ className }: { className?: string }) {
  return <div className={`bg-cream-200 animate-pulse rounded ${className ?? ""}`} />;
}

export default function KategoriLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <SkeletonBox className="h-3 w-16" />
        <span className="text-ink-300">/</span>
        <SkeletonBox className="h-3 w-24" />
      </div>

      {/* Başlık */}
      <SkeletonBox className="h-8 w-48 mb-2" />
      <SkeletonBox className="h-4 w-80 mb-10" />

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 space-y-4">
          <SkeletonBox className="h-5 w-24 mb-4" />
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBox key={i} className="h-4 w-full" />
          ))}
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <SkeletonBox className="aspect-[3/4] w-full mb-3" />
                <SkeletonBox className="h-4 w-3/4 mb-2" />
                <SkeletonBox className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
