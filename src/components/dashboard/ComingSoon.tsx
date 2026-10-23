import { PageHeader } from "./PageHeader";

export function ComingSoon({ title, step }: { title: string; step: string }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="rounded-2xl border border-dashed border-line bg-white p-12 text-center text-sm text-muted">
        This page is built in {step}.
      </div>
    </>
  );
}
