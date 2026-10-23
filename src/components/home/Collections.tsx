"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { imageUrl } from "@/lib/api";
import { ProductImage } from "@/components/product/ProductImage";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { categoryHref } from "@/lib/format";
import type { SubCategory } from "@/lib/types";

const TINTS = ["#f6d7c3", "#cfe4dc", "#dcdff0", "#f3e3b8"];

export function Collections({ subCategories }: { subCategories: SubCategory[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
      <SectionHeading title="Collections" link={{ href: "/collections/all", label: "View all" }} />
      <RevealGroup className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {subCategories.slice(0, 4).map((cat, i) => {
          return (
            <RevealItem key={cat.id}>
              <Link
                href={categoryHref(cat.category_id, cat.id)}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl"
                style={{ background: TINTS[i % TINTS.length] }}
              >
                {cat.image && (
                  <motion.div className="absolute inset-0 transition-transform duration-[900ms] ease-out-expo group-hover:scale-110 group-hover:-rotate-2">
                    <ProductImage
                      src={imageUrl(cat.image)}
                      alt=""
                      id={cat.id}
                      className="p-10"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                    />
                  </motion.div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/0 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white sm:p-5">
                  <div>
                    <h3 className="text-lg font-bold sm:text-xl">{cat.name}</h3>
                    <p className="text-xs opacity-85">Shop now</p>
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
