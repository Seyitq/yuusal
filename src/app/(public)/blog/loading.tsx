// Blog liste sayfası skeleton
function SkeletonBox({ className }: { className?: string }) {
  return <div className={`bg-cream-200 animate-pulse rounded ${className ?? ""}`} />;
}

export default function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SkeletonBox className="h-8 w-32 mb-2 mx-auto" />
      <SkeletonBox className="h-4 w-64 mb-10 mx-auto" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <SkeletonBox className="aspect-video w-full mb-4" />
            <SkeletonBox className="h-3 w-24 mb-3" />
            <SkeletonBox className="h-5 w-full mb-2" />
            <SkeletonBox className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
