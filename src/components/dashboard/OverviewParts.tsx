import Link from "next/link";
import type { ReactNode } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import type { Product } from "@/lib/types";

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "warn";
}) {
  return (
    <div
      className={
        tone === "warn"
          ? "rounded-2xl border border-amber-300 bg-amber-50 p-6"
          : "rounded-2xl border border-line bg-white p-6"
      }
    >
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-3xl font-extrabold tracking-tight">{value}</dd>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  href,
  link,
  children,
}: {
  title: string;
  href: string;
  link: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>
        <Link href={href} className="text-xs font-semibold underline underline-offset-4">
          {link}
        </Link>
      </div>
      {children}
    </div>
  );
}

export function ProductRow({
  product,
  trailing,
  href,
}: {
  product: Product;
  trailing: ReactNode;
  href: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#f2f2f2]">
        <ProductImage
          src={product.image}
          alt={product.title}
          id={product.id}
          sizes="48px"
          className="p-1"
        />
      </div>
      <Link
        href={href}
        className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold hover:underline"
      >
        {product.title}
      </Link>
      <div className="shrink-0">{trailing}</div>
    </li>
  );
}
