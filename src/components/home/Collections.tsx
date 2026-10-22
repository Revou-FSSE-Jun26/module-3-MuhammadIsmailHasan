"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ProductImage } from "@/components/product/ProductImage";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { categoryHref, categoryLabel } from "@/lib/format";
import type { Product } from "@/lib/types";

const TINTS = ["#f6d7c3", "#cfe4dc", "#dcdff0", "#f3e3b8"];

export function Collections({
  categories,
  products,
}: {
  categories: string[];
  products: Product[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
      <SectionHeading title="Collections" link={{ href: "/collections/all", label: "View all" }} />
      <RevealGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {categories.slice(0, 4).map((cat, i) => {
          const items = products.filter((p) => p.category === cat);
          const cover = items[0];
          return (
            <RevealItem key={cat}>
              <Link
                href={categoryHref(cat)}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
                style={{ background: TINTS[i % TINTS.length] }}
              >
                {cover && (
                  <motion.div className="absolute inset-0 transition-transform duration-[900ms] ease-out-expo group-hover:scale-110 group-hover:-rotate-2">
                    <ProductImage
                      src={cover.image}
                      alt=""
                      id={cover.id}
                      className="p-10"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                    />
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white sm:p-5">
                  <div>
                    <h3 className="text-lg font-bold sm:text-xl">{categoryLabel(cat)}</h3>
                    <p className="text-xs opacity-85">{items.length} products</p>
                  </div>
                  <span className="grid size-10 translate-y-2 place-items-center rounded-full bg-white text-ink opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <Icon name="arrowRight" size={16} />
                  </span>
                </div>
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}
