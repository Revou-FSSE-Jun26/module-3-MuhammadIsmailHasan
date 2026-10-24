import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";
import { BackToTop } from "./BackToTop";

export function Footer() {
  return (
    <footer id="contact" className="mt-24 scroll-mt-32 border-t border-line bg-[#fafafa]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <Reveal className="lg:col-span-2">
          <Link href="/" className="text-2xl font-extrabold">
            {siteConfig.name}
          </Link>
          <p className="mt-4 max-w-sm text-sm text-muted">
            An online shop built as a learning project. Products and data are for demonstration
            only.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Icon name="mail" size={17} />
              {siteConfig.email}
            </li>
            <li className="flex items-center gap-3">
              <Icon name="pin" size={17} />
              Ngawi, Jawa Timur
            </li>
          </ul>
        </Reveal>

        {siteConfig.footer.map((col, i) => (
          <Reveal key={col.title} delay={0.1 * (i + 1)}>
            <h3 className="text-sm font-bold uppercase tracking-wider">{col.title}</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
              {col.title === "About" && (
                <li>
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-ink"
                  >
                    Source code
                  </a>
                </li>
              )}
            </ul>
          </Reveal>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-muted sm:flex-row sm:px-6">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. A learning project by Muhammad Ismail
            Hasan.
          </p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
