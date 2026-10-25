import type { Metadata } from "next";
import Link from "next/link";
import { WishlistView } from "@/components/product/WishlistView";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="text-xs text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>{" "}
        / <span className="text-ink">Wishlist</span>
      </nav>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
