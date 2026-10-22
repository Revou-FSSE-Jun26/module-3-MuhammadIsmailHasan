"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/ui/Icon";
import { cn, formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export function Header() {
  const { count, subtotal, open, wishlist } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Hide on scroll down, reveal on scroll up
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 10);
    setHidden(y > prev && y > 220 && !menuOpen);
  });

  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/collections/all?q=${encodeURIComponent(q)}` : "/collections/all");
  }

  return (
    <>
      <motion.header
        className={cn(
          "sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-[border-color,box-shadow] duration-300",
          scrolled ? "border-line shadow-[0_8px_30px_rgb(0_0_0/0.06)]" : "border-transparent",
        )}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:h-20 sm:px-6">
          <button
            type="button"
            className="grid size-11 place-items-center lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={22} />
          </button>

          <Link href="/" className="text-xl font-extrabold tracking-tight sm:text-2xl">
            {siteConfig.name}
          </Link>

          <form
            onSubmit={onSearch}
            className="relative ml-6 hidden max-w-xl flex-1 md:block"
            role="search"
          >
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              id="site-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="h-11 w-full rounded-full border border-line bg-[#f6f6f6] pl-5 pr-12 text-sm outline-none transition focus:border-ink focus:bg-white"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 grid size-9 place-items-center rounded-full text-ink hover:bg-white"
              aria-label="Search"
            >
              <Icon name="search" size={18} />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="mr-3 hidden items-center gap-2 xl:flex"
            >
              <span className="grid size-10 place-items-center rounded-full bg-[#f3f3f3]">
                <Icon name="phone" size={17} />
              </span>
              <span className="text-xs leading-tight text-muted">
                Need help?
                <br />
                <b className="text-sm text-ink">{siteConfig.phone}</b>
              </span>
            </a>
            <Link
              href="#"
              className="hidden size-11 place-items-center rounded-full hover:bg-[#f3f3f3] sm:grid"
              aria-label="Account"
            >
              <Icon name="user" size={21} />
            </Link>
            <Link
              href="/collections/all"
              className="relative hidden size-11 place-items-center rounded-full hover:bg-[#f3f3f3] sm:grid"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Icon name="heart" size={21} />
              <CountBadge value={wishlist.length} />
            </Link>
            <button
              type="button"
              onClick={open}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 hover:bg-[#f3f3f3] sm:pr-3"
              aria-label={`Open cart, ${count} items`}
            >
              <span className="relative grid size-10 place-items-center">
                <Icon name="bag" size={21} />
                <CountBadge value={count} />
              </span>
              <span className="hidden text-left text-xs leading-tight text-muted sm:block">
                Cart
                <br />
                <b className="text-sm text-ink">{formatPrice(subtotal)}</b>
              </span>
            </button>
          </div>
        </div>

        <nav
          className="mx-auto hidden h-12 max-w-7xl items-center justify-between px-6 lg:flex"
          aria-label="Main"
        >
          <ul className="flex gap-8">
            {siteConfig.mainNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href.split("#")[0]) && item.href !== "/#newsletter";
              return (
                <li key={item.label}>
                  <Link href={item.href} className="group relative py-3 text-sm font-semibold">
                    {item.label}
                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left bg-ink transition-transform duration-300 ease-out-expo",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="flex gap-6 text-sm text-muted">
            {siteConfig.secondaryNav.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[86%] max-w-sm flex-col bg-white p-6"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              aria-label="Mobile menu"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold">{siteConfig.name}</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="grid size-11 place-items-center"
                  aria-label="Close menu"
                >
                  <Icon name="close" />
                </button>
              </div>
              <form onSubmit={onSearch} className="mt-6" role="search">
                <label htmlFor="mobile-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="mobile-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="h-11 w-full rounded-full border border-line px-5 text-sm outline-none focus:border-ink"
                />
              </form>
              <motion.ul
                className="mt-6 flex flex-col"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
                }}
              >
                {[...siteConfig.mainNav, ...siteConfig.secondaryNav].map((item) => (
                  <motion.li
                    key={item.label}
                    variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
                  >
                    <Link
                      href={item.href}
                      className="block border-b border-line py-4 text-lg font-semibold"
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function CountBadge({ value }: { value: number }) {
  return (
    <AnimatePresence>
      {value > 0 && (
        <motion.span
          key={value}
          className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold leading-5 text-white"
          initial={{ scale: 0 }}
          animate={{ scale: [1.4, 1] }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.35 }}
        >
          {value}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
