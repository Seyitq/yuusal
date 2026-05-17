// Ürün detay sayfası skeleton
function SkeletonBox({ className }: { className?: string }) {
  return <div className={`bg-cream-200 animate-pulse rounded ${className ?? ""}`} />;
}

export default function UrunLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <SkeletonBox className="h-3 w-16" />
        <span className="text-ink-300">/</span>
        <SkeletonBox className="h-3 w-20" />
        <span className="text-ink-300">/</span>
        <SkeletonBox className="h-3 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Sol: Galeri */}
        <div>
          <SkeletonBox className="aspect-square w-full mb-4" />
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonBox key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>

        {/* Sağ: Bilgiler */}
        <div className="space-y-4">
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-8 w-3/4" />
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-5/6" />

          <div className="pt-4 space-y-2">
            <SkeletonBox className="h-3 w-24" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <SkeletonBox key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>

          <SkeletonBox className="h-14 w-full mt-6" />
        </div>
      </div>
    </div>
  );
}
