"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 text-muted">
        The server may be waking up (first request can take up to a minute). Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white"
      >
        Try again
      </button>
    </div>
  );
}
