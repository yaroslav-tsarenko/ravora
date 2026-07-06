"use client";

import { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";

interface Slide {
  titleKey: string;
  subtitleKey: string;
  ctaHref: string;
  ctaKey: string;
  secondaryCtaHref?: string;
  secondaryCtaKey?: string;
  badge?: string;
  image: StaticImageData;
}

const slides: Slide[] = [
  {
    badge: "Professional grade",
    titleKey: "heroTitle",
    subtitleKey: "heroSubtitle",
    ctaHref: "/catalog",
    ctaKey: "heroCta",
    secondaryCtaHref: "/catalog?sort=newest",
    secondaryCtaKey: "heroExplore",
    image: banner1,
  },
  {
    badge: "Limited time offer",
    titleKey: "heroSale",
    subtitleKey: "heroSaleSubtitle",
    ctaHref: "/catalog?onSale=true",
    ctaKey: "heroShopSale",
    image: banner2,
  },
  {
    badge: "Just arrived",
    titleKey: "heroNew",
    subtitleKey: "heroNewSubtitle",
    ctaHref: "/catalog?sort=newest",
    ctaKey: "heroExplore",
    image: banner3,
  },
];

export function HeroBanner() {
  const t = useTranslations("home");
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];
  const titleWords = t(slide.titleKey).split(" ");

  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          aria-hidden
        >
          <Image
            src={slide.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-[0.2] mix-blend-multiply dark:opacity-25 dark:mix-blend-screen"
            priority={current === 0}
          />
          <span className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-bg)]/95 via-[color:var(--color-bg)]/70 to-[color:var(--color-bg)]/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto flex min-h-[520px] max-w-[var(--container-content)] flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="flex max-w-2xl flex-col gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {slide.badge && (
              <motion.div
                className="inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-primary)] bg-[color:var(--color-primary-tint)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles size={12} />
                {slide.badge}
              </motion.div>
            )}

            <motion.h1
              className="font-serif text-[40px] font-medium leading-[1.05] tracking-tight text-[color:var(--color-text)] sm:text-[54px] lg:text-[64px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {titleWords.map((word, i, arr) =>
                i >= arr.length - 2 ? (
                  <em key={i} className="not-italic font-serif italic text-[color:var(--color-accent)]">
                    {word}{" "}
                  </em>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </motion.h1>

            <motion.p
              className="max-w-xl text-base leading-relaxed text-[color:var(--color-text-secondary)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              {t(slide.subtitleKey)}
            </motion.p>

            <motion.div
              className="mt-2 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Link
                href={slide.ctaHref}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--color-accent-hover)]"
              >
                {t(slide.ctaKey)} <ArrowRight size={16} />
              </Link>
              {slide.secondaryCtaHref && slide.secondaryCtaKey && (
                <Link
                  href={slide.secondaryCtaHref}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-primary)] px-5 py-3 text-sm font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary-tint)]"
                >
                  {t(slide.secondaryCtaKey)}
                </Link>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-2 text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] sm:inline-flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-2 text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] sm:inline-flex"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === current
                ? "w-8 bg-[color:var(--color-primary)]"
                : "w-1.5 bg-[color:var(--color-line-strong)] hover:bg-[color:var(--color-primary)]/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
