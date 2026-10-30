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
import { inStock, pickCollections, pickDiverse } from "@/lib/catalog";

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getProducts({ limit: 40, sort_by: "best_selling", order: "desc" }),
    getProducts({ limit: 30, sort_by: "created_at", order: "desc" }),
    getCategories(),
  ]);
  const sellers = inStock(featured.items);
  const fresh = inStock(latest.items);
  const topSellers = sellers.slice(0, 5);
  const popular = sellers.slice(5, 11);
  const newest = fresh.slice(0, 5);

  return (
    <>
      <HeroSlider />
      <Collections subCategories={pickCollections(categories, 4)} />
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
      <Lookbook products={pickDiverse(fresh, 3)} />
      <PromoMarquee />
      <Features />
      <ProjectRoles />
      <Faq />
    </>
  );
}
