// Public layout düzeyindeki genel loading skeleton
export default function PublicLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
        <span className="font-sans text-xs uppercase tracking-widest text-ink-400">
          Yükleniyor
        </span>
      </div>
    </div>
  );
}
