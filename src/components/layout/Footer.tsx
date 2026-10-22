import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";
import { BackToTop } from "./BackToTop";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-[#fafafa]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <Reveal className="lg:col-span-2">
          <Link href="/" className="text-2xl font-extrabold">
            {siteConfig.name}
          </Link>
          <p className="mt-4 max-w-xs text-sm text-muted">
            Everyday essentials, tech and style — picked with care and delivered to your door.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Icon name="pin" size={17} />
              {siteConfig.address}
            </li>
            <li className="flex items-center gap-3">
              <Icon name="phone" size={17} />
              {siteConfig.phone}
            </li>
            <li className="flex items-center gap-3">
              <Icon name="mail" size={17} />
              {siteConfig.email}
            </li>
          </ul>
        </Reveal>

        {siteConfig.footer.map((col, i) => (
          <Reveal key={col.title} delay={0.1 * (i + 1)}>
            <h3 className="text-sm font-bold uppercase tracking-wider">{col.title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {col.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="group inline-flex items-center gap-1 transition-colors hover:text-ink"
                  >
                    <span className="w-0 overflow-hidden transition-all duration-300 group-hover:w-3">
                      –
                    </span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
