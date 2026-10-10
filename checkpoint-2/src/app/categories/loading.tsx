export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="h-8 w-56 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </main>
  );
}
