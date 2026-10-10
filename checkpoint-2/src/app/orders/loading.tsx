export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="h-8 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-20 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
