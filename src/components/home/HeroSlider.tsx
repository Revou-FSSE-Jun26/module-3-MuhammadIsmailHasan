"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SplitText } from "@/components/ui/Reveal";
import { cn } from "@/lib/format";
import { siteConfig } from "@/lib/site";

const AUTOPLAY_MS = 6000;
const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSlider() {
  const slides = siteConfig.heroSlides;
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => setState(([i]) => [(i + dir + slides.length) % slides.length, dir]),
    [slides.length],
  );
  const goTo = (i: number) => setState(([cur]) => [i, i > cur ? 1 : -1]);

  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => go(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, paused, go]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -80) go(1);
    else if (info.offset.x > 80) go(-1);
  }

  const slide = slides[index];

  return (
    <section
      className="relative h-[700px] overflow-hidden bg-cream lg:h-[720px]"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          variants={{
            enter: (d: number) => ({ clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }),
            center: { clipPath: "inset(0 0 0 0%)" },
            exit: { zIndex: 0 },
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.1, ease: EASE }}
          style={{ zIndex: 1, background: slide.bg }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${slides.length}`}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6.5, ease: "easeOut" }}
          >
            {slide.layout === "split" ? (
              <div className="absolute inset-x-0 top-0 h-[340px] [mask-image:linear-gradient(to_bottom,black_85%,transparent)] sm:h-[400px] lg:inset-x-auto lg:-right-[22%] lg:h-full lg:w-[1200px] lg:[mask-image:linear-gradient(to_right,transparent,black_22%)] xl:-right-[12%]">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 1200px, 100vw"
                  className="origin-top scale-[1.02] object-cover"
                  style={{ objectPosition: slide.position }}
                />
              </div>
            ) : (
              <Image
                src={slide.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: slide.position }}
              />
            )}
          </motion.div>
          <div
            className={cn(
              "absolute inset-0",
              slide.layout === "full" &&
                slide.tone === "light" &&
                "bg-linear-to-t from-black/65 via-black/30 to-black/20 sm:bg-linear-to-r sm:from-black/10 sm:via-black/25 sm:to-black/60",
            )}
          />

          <div
            className={cn(
              "relative mx-auto flex h-full max-w-7xl items-end px-4 pb-24 sm:px-6",
              slide.align === "left" ? "justify-start" : "justify-end sm:items-center sm:pb-0",
              slide.layout === "split" && "lg:items-center lg:pb-0",
            )}
          >
            <div
              className={cn(
                "max-w-xl",
                slide.align === "left" ? "text-left lg:max-w-lg" : "text-right",
                slide.tone === "light"
                  ? "text-white drop-shadow-[0_2px_12px_rgb(0_0_0/0.35)]"
                  : "text-ink",
              )}
            >
              <motion.span
                className="inline-block rounded-full bg-ink/85 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
              >
                {slide.eyebrow}
              </motion.span>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                <SplitText text={slide.title} delay={0.6} animateOnMount />
              </h1>
              <motion.p
                className={cn(
                  "mt-4 max-w-md text-base sm:text-lg",
                  slide.align === "left" ? "mr-auto" : "ml-auto",
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.7, ease: EASE }}
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.7, ease: EASE }}
              >
                <Link
                  href={slide.cta.href}
                  className={cn(
                    "group mt-8 inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-bold transition",
                    slide.tone === "light"
                      ? "bg-white text-ink hover:bg-ink hover:text-white"
                      : "bg-ink text-white hover:bg-black",
                  )}
                >
                  {slide.cta.label}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <Icon name="arrowRight" size={16} />
                  </span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              onClick={() => goTo(i)}
              className="relative h-11 w-12 py-5"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            >
              <span
                className={cn(
                  "block h-1 w-full overflow-hidden rounded-full",
                  slide.tone === "light" ? "bg-white/50" : "bg-ink/20",
                )}
              >
                {i === index && (
                  <motion.span
                    key={`${index}-${paused}`}
                    className={cn(
                      "block h-full origin-left",
                      slide.tone === "light" ? "bg-white" : "bg-ink",
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: paused ? 0 : 1 }}
                    transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            className="grid size-12 place-items-center rounded-full bg-ink text-white shadow-lg transition hover:scale-105 hover:bg-black"
            aria-label="Previous slide"
          >
            <Icon name="arrowLeft" size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="grid size-12 place-items-center rounded-full bg-ink text-white shadow-lg transition hover:scale-105 hover:bg-black"
            aria-label="Next slide"
          >
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
