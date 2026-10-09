import Link from "next/link";

interface HeaderProps {
  cartItemCount?: number;
}

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Orders", href: "/orders" },
];

export default function Header({ cartItemCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200/70 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span aria-hidden className="flex gap-0.5">
            <span className="h-4 w-1 rounded-full bg-brand-600" />
            <span className="h-5 w-1 rounded-full bg-brand-500" />
            <span className="h-3 w-1 rounded-full bg-accent-500" />
          </span>
          <span className="text-base font-bold tracking-tight text-neutral-900">RevoShop</span>
        </Link>

        <nav className="hidden flex-1 justify-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            aria-label="Search products"
            className="grid h-9 w-9 place-items-center rounded-full text-neutral-600 hover:bg-muted"
          >
            <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="9" cy="9" r="5.5" />
              <path d="m13.5 13.5 3 3" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            aria-label={`Cart, ${cartItemCount} items`}
            className="relative grid h-9 w-9 place-items-center rounded-full text-neutral-600 hover:bg-muted"
          >
            <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 4h2l1.6 8.2a1.5 1.5 0 0 0 1.5 1.2h6.3a1.5 1.5 0 0 0 1.5-1.2L17 7H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="16.5" r="1.1" fill="currentColor" stroke="none" />
              <circle cx="14.5" cy="16.5" r="1.1" fill="currentColor" stroke="none" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold tabular-nums text-white">
                {cartItemCount}
              </span>
            )}
          </button>

          <Link
            href="/products"
            className="hidden h-9 items-center rounded-full bg-brand-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:inline-flex"
          >
            Shop now
          </Link>
        </div>
      </div>
    </header>
  );
}
