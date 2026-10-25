import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { getCategories } from "@/lib/api";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories().catch(() => []);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <AnnouncementBar />
      <Header categories={categories} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
