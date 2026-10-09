import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import ProductCatalog from "@/app/components/ProductCatalog";
import { mockProducts } from "@/data/mock-products";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Featured products</h1>
        <div className="mt-6">
          <ProductCatalog initialProducts={mockProducts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
