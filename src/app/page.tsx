import { Collections } from "@/components/home/Collections";
import { Faq } from "@/components/home/Faq";
import { Features } from "@/components/home/Features";
import { HeroSlider } from "@/components/home/HeroSlider";
import { Lookbook } from "@/components/home/Lookbook";
import { News } from "@/components/home/News";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductGrid } from "@/components/home/ProductGrid";
import { PromoMarquee } from "@/components/home/PromoMarquee";
import { Recommend } from "@/components/home/Recommend";
import { TechEssentials } from "@/components/home/TechEssentials";
import { Testimonials } from "@/components/home/Testimonials";
import { getCategories, getProducts } from "@/lib/api";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const topRated = [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 5);
  const newest = [...products].reverse().slice(0, 5);
  const tech = products.filter((p) => p.category === "electronics");
  const lookbook = products.filter((p) => p.category.includes("clothing"));
  const pick = [...products].sort((a, b) => b.rating.count - a.rating.count)[0];

  return (
    <>
      <HeroSlider />
      <Collections categories={categories} products={products} />
      <ProductGrid
        title="Top sellers"
        eyebrow="Featured products"
        ghost="Best Sellers"
        products={topRated}
        link={{ href: "/collections/all", label: "Shop all" }}
      />
      <TechEssentials products={tech.length ? tech : products.slice(0, 6)} />
      <ProductGrid
        title="New arrivals"
        eyebrow="Just landed"
        ghost="New In"
        products={newest}
        link={{ href: "/collections/all", label: "Shop all" }}
      />
      <Lookbook products={lookbook.length >= 3 ? lookbook : products} />
      <PromoMarquee />
      <Features />
      <Recommend product={pick} />
      <Testimonials />
      <News />
      <Faq />
      <Newsletter />
    </>
  );
}
