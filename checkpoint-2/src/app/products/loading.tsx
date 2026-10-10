import ProductGridSkeleton from "@/app/components/ui/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="h-11 w-full max-w-sm animate-pulse rounded-full bg-muted" />
        <div className="h-11 w-44 animate-pulse rounded-full bg-muted" />
      </div>
      <ProductGridSkeleton />
    </div>
  );
}
