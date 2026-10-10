import ProductGridSkeleton from "@/app/components/ui/ProductGridSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="h-64 animate-pulse rounded-3xl bg-brand-50" />
      <div className="mt-14 h-8 w-56 animate-pulse rounded bg-muted" />
      <div className="mt-6">
        <ProductGridSkeleton count={5} />
      </div>
    </main>
  );
}
