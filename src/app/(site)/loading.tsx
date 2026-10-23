export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6" aria-busy="true">
      <div className="h-10 w-64 animate-pulse rounded-full bg-[#f2f2f2]" />
      <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-[#f2f2f2]" />
        ))}
      </div>
    </div>
  );
}
