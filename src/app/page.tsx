import { Collections } from "@/components/home/Collections";
import { Faq } from "@/components/home/Faq";
import { Features } from "@/components/home/Features";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Lookbook } from "@/components/home/Lookbook";
import { ProductGrid } from "@/components/home/ProductGrid";
import { PromoMarquee } from "@/components/home/PromoMarquee";
import { TechEssentials } from "@/components/home/TechEssentials";
import { Testimonials } from "@/components/home/Testimonials";
import { getCategories, getProducts } from "@/lib/api";

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getProducts({ limit: 10 }),
    getProducts({ limit: 10, sort_by: "created_at", order: "desc" }),
    getCategories(),
  ]);
  const products = featured.items;
  const newest = latest.items.slice(0, 5);

  return (
    <>
      <HeroSlider />
      <Collections subCategories={categories.flatMap((c) => c.sub_categories ?? [])} />
      <ProductGrid
        title="Top sellers"
        eyebrow="Featured products"
        ghost="Best Sellers"
        products={products.slice(0, 5)}
        link={{ href: "/collections/all", label: "Shop all" }}
      />
      <TechEssentials products={products.slice(0, 6)} />
      <ProductGrid
        title="New arrivals"
        eyebrow="Just landed"
        ghost="New In"
        products={newest}
        link={{ href: "/collections/all", label: "Shop all" }}
      />
      <Lookbook products={latest.items} />
      <PromoMarquee />
      <Features />
      <Testimonials />
      <Faq />
    </>
  );
}
