import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-busy="true">
      <div className="h-3 w-48 animate-pulse rounded-full bg-[#f2f2f2]" />
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="relative aspect-square animate-pulse rounded-3xl bg-[#f2f2f2]">
            <span className="absolute inset-0 grid place-items-center text-muted">
              <Spinner className="size-8" />
            </span>
          </div>
          <div className="mt-3 flex gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="size-20 animate-pulse rounded-xl bg-[#f2f2f2]" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded-full bg-[#f2f2f2]" />
          <div className="h-10 w-4/5 animate-pulse rounded-full bg-[#f2f2f2]" />
          <div className="h-3 w-28 animate-pulse rounded-full bg-[#f2f2f2]" />
          <div className="h-9 w-40 animate-pulse rounded-full bg-[#f2f2f2]" />
          <div className="space-y-2 pt-4">
            <div className="h-3 w-full animate-pulse rounded-full bg-[#f2f2f2]" />
            <div className="h-3 w-full animate-pulse rounded-full bg-[#f2f2f2]" />
            <div className="h-3 w-2/3 animate-pulse rounded-full bg-[#f2f2f2]" />
          </div>
          <div className="flex gap-3 pt-6">
            <div className="h-12 w-32 animate-pulse rounded-full bg-[#f2f2f2]" />
            <div className="h-12 flex-1 animate-pulse rounded-full bg-[#f2f2f2]" />
          </div>
        </div>
      </div>
    </div>
  );
}
