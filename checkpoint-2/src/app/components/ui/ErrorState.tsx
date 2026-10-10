"use client";

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/60 p-8 text-center">
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 h-10 rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
      >
        Try again
      </button>
    </div>
  );
}
