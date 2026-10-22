import Link from "next/link";
import { Scene } from "@/components/illustrations/Scene";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function News() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <SectionHeading
        title="Latest news"
        eyebrow="From the blog"
        link={{ href: "#", label: "All articles" }}
      />
      <RevealGroup className="grid gap-8 md:grid-cols-3">
        {siteConfig.news.map((post, i) => (
          <RevealItem key={i}>
            <Link href="#" className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <div className="absolute inset-0 transition-transform duration-[900ms] ease-out-expo group-hover:scale-110">
                  <Scene variant={post.scene} palette={post.palette} />
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold">
                  {post.tag}
                </span>
              </div>
              <time
                dateTime={post.date}
                className="mt-4 block text-xs uppercase tracking-wider text-muted"
              >
                {dateFmt.format(new Date(post.date))}
              </time>
              <h3 className="mt-1 text-lg font-bold">
                <span className="bg-linear-to-r from-ink to-ink bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                  {post.title}
                </span>
              </h3>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
