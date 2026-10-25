import { Collections } from "@/components/home/Collections";
import { Faq } from "@/components/home/Faq";
import { Features } from "@/components/home/Features";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Lookbook } from "@/components/home/Lookbook";
import { ProductGrid } from "@/components/home/ProductGrid";
import { PromoMarquee } from "@/components/home/PromoMarquee";
import { PopularPicks } from "@/components/home/PopularPicks";
import { ProjectRoles } from "@/components/home/ProjectRoles";
import { getCategories, getProducts } from "@/lib/api";

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getProducts({ limit: 11, sort_by: "best_selling", order: "desc" }),
    getProducts({ limit: 10, sort_by: "created_at", order: "desc" }),
    getCategories(),
  ]);
  const topSellers = featured.items.slice(0, 5);
  const popular = featured.items.slice(5, 11);
  const newest = latest.items.slice(0, 5);

  return (
    <>
      <HeroSlider />
      <Collections subCategories={categories.flatMap((c) => c.sub_categories ?? [])} />
      <ProductGrid
        title="Top sellers"
        eyebrow="Featured products"
        ghost="Best Sellers"
        products={topSellers}
        link={{ href: "/collections/all", label: "Shop all" }}
      />
      <PopularPicks products={popular} />
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
      <ProjectRoles />
      <Faq />
    </>
  );
}
