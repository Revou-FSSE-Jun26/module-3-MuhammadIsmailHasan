import LayoutMountProbe from "@/app/components/LayoutMountProbe";

export default function ProductsLayout({ children }: LayoutProps<"/products">) {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Products</h1>
        <LayoutMountProbe label="Products layout" />
      </div>
      <div className="mt-6">{children}</div>
    </main>
  );
}
