import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Orders", href: "/orders" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Shipping", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200/70 bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <span className="text-base font-bold tracking-tight text-neutral-900">RevoShop</span>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
            Electronics, clothing and groceries, delivered across Indonesia.
          </p>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.heading}>
            <h2 className="text-sm font-semibold text-neutral-900">{group.heading}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200/70">
        <p className="mx-auto w-full max-w-6xl px-4 py-5 text-xs text-neutral-400">
          Built for Revou Bootcamp Module 3.
        </p>
      </div>
    </footer>
  );
}
