"use client";

import ErrorState from "@/app/components/ui/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <ErrorState title="We could not load categories" message={error.message} onRetry={reset} />
    </main>
  );
}
