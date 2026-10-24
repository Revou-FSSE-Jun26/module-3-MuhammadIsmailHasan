import { cn } from "@/lib/format";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-line bg-white text-sm text-muted">
      <Spinner className="size-8 text-ink" />
      <p>{label}</p>
    </div>
  );
}
