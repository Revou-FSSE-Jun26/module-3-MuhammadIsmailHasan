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
    <ErrorState
      title="We could not load the product list"
      message={error.message}
      onRetry={reset}
    />
  );
}
