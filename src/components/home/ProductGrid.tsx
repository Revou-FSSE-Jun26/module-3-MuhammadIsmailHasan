import { ProductCard } from "@/components/product/ProductCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/lib/types";

export function ProductGrid({
  title,
  eyebrow,
  ghost,
  products,
  link,
}: {
  title: string;
  eyebrow?: string;
  ghost?: string;
  products: Product[];
  link?: { href: string; label: string };
}) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-7xl overflow-x-clip px-4 pt-24 sm:px-6">
      <SectionHeading title={title} eyebrow={eyebrow} ghost={ghost} link={link} />
      <RevealGroup className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
        {products.map((p) => (
          <RevealItem key={p.id}>
            <ProductCard product={p} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
