"use client";

import { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import {
  ChevronLeft, ChevronRight, ArrowRight, Truck, ShieldCheck,
  RotateCcw, Zap, Headphones, Watch, BatteryCharging,
} from "lucide-react";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";

interface SlideData {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  ctaLabel?: string | null;
  bgColor: string;
  textColor: string;
  badgeText?: string | null;
}

interface DealData {
  id: string;
  title: string;
  oldPrice?: string | null;
  newPrice?: string | null;
  discountText?: string | null;
  linkUrl?: string | null;
  imageUrl?: string | null;
}

interface RavoraSlide {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  bgImage: StaticImageData;
  thumbLabel: string;
  thumbHint: string;
  thumbIcon: React.ElementType;
}

const ravoraSlides: RavoraSlide[] = [
  {
    id: "audio",
    eyebrow: "Vol. 01 · Audio",
    title: (
      <>
        Sound that goes
        <br />
        <em className="font-serif italic text-[color:var(--color-accent)]">where you go.</em>
      </>
    ),
    subtitle:
      "Wireless headphones, soundbars and Hi-Fi gear from thoughtful, quiet brands — carefully sourced and shipped from the United Kingdom.",
    primaryCta: { label: "Shop audio", href: "/catalog/audio-and-hi-fi-equipment" },
    secondaryCta: { label: "Headphones", href: "/catalog/headphones" },
    bgImage: banner1,
    thumbLabel: "Audio",
    thumbHint: "Editor's picks",
    thumbIcon: Headphones,
  },
  {
    id: "power",
    eyebrow: "Vol. 02 · Power",
    title: (
      <>
        Stay charged.
        <br />
        <em className="font-serif italic text-[color:var(--color-accent)]">Stay quiet.</em>
      </>
    ),
    subtitle:
      "Chargers, batteries and multi-socket adapters engineered for everyday desks and travel bags.",
    primaryCta: { label: "Shop power", href: "/catalog/batteries-and-chargers" },
    secondaryCta: { label: "Adapters", href: "/catalog/power-strips" },
    bgImage: banner2,
    thumbLabel: "Power",
    thumbHint: "Everyday essentials",
    thumbIcon: BatteryCharging,
  },
  {
    id: "smart",
    eyebrow: "Vol. 03 · Smart",
    title: (
      <>
        Smart tech
        <br />
        <em className="font-serif italic text-[color:var(--color-accent)]">without noise.</em>
      </>
    ),
    subtitle:
      "Smartwatches, GPS and action cameras — curated for the way you actually live and work.",
    primaryCta: { label: "Browse new arrivals", href: "/catalog?sort=newest" },
    secondaryCta: { label: "Smartwatches", href: "/catalog?search=watch" },
    bgImage: banner3,
    thumbLabel: "Smart",
    thumbHint: "New this week",
    thumbIcon: Watch,
  },
];

const trustItems = [
  { icon: Truck, label: "Free UK shipping", sub: "Over £100" },
  { icon: RotateCcw, label: "14-day returns", sub: "No questions" },
  { icon: ShieldCheck, label: "Genuine warranty", sub: "Every product" },
  { icon: Zap, label: "Same-day dispatch", sub: "Before 14:00 GMT" },
];

interface Props {
  slides: SlideData[];
  deals: DealData[];
}

export function HeroCarousel({ deals }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const slide = ravoraSlides[current];

  const go = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(((idx % ravoraSlides.length) + ravoraSlides.length) % ravoraSlides.length);
    },
    [current]
  );

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((p) => (p + 1) % ravoraSlides.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="border-b border-[color:var(--color-line)] bg-[color:var(--color-bg)]"
      aria-label="Featured collections"
    >
      <div
        className={`mx-auto grid max-w-[var(--container-content)] gap-8 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 ${
          deals.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_320px]" : "lg:grid-cols-1"
        }`}
      >
        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)]">
            {/* Background image, gently */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${slide.id}-bg`}
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden
              >
                <Image
                  src={slide.bgImage}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 1280px"
                  placeholder="blur"
                  className="object-cover opacity-[0.18] mix-blend-multiply dark:opacity-25 dark:mix-blend-screen"
                  priority
                />
                <span className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-bg-elevated)]/95 via-[color:var(--color-bg-elevated)]/70 to-[color:var(--color-bg-elevated)]/40" />
              </motion.div>
            </AnimatePresence>

            <div className="relative grid gap-6 p-8 sm:p-12 lg:min-h-[440px] lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-10 lg:p-16">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id}
                  className="flex flex-col gap-6"
                  initial={{ opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="inline-flex items-center gap-2 self-start text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-primary)]">
                    <span className="h-px w-6 bg-[color:var(--color-primary)]/50" />
                    {slide.eyebrow}
                  </span>
                  <h1 className="font-serif text-[40px] font-medium leading-[1.05] tracking-tight text-[color:var(--color-text)] sm:text-[54px] lg:text-[64px]">
                    {slide.title}
                  </h1>
                  <p className="max-w-lg text-base leading-relaxed text-[color:var(--color-text-secondary)]">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={slide.primaryCta.href}
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--color-accent-hover)]"
                    >
                      {slide.primaryCta.label} <ArrowRight size={16} />
                    </Link>
                    {slide.secondaryCta && (
                      <Link
                        href={slide.secondaryCta.href}
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-primary)] px-5 py-3 text-sm font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary-tint)]"
                      >
                        {slide.secondaryCta.label}
                      </Link>
                    )}
                  </div>

                  <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-[color:var(--color-line)] pt-6 lg:grid-cols-4">
                    {trustItems.map((t) => (
                      <li key={t.label} className="flex items-center gap-2.5">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                          <t.icon size={14} strokeWidth={1.5} />
                        </span>
                        <span className="flex flex-col leading-tight">
                          <span className="text-xs font-semibold text-[color:var(--color-text)]">
                            {t.label}
                          </span>
                          <span className="text-[11px] text-[color:var(--color-text-tertiary)]">
                            {t.sub}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>

              <div className="hidden justify-center lg:flex" aria-hidden>
                <motion.div
                  className="flex flex-col items-center rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-bg)] px-8 py-6 text-center shadow-sm"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.55, delay: 0.25 }}
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                    From
                  </span>
                  <span className="mt-1 font-serif text-5xl font-medium text-[color:var(--color-text)]">
                    £8.29
                  </span>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-[color:var(--color-success)]">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--color-success)]" />
                    In stock today
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between sm:inset-x-8">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous slide"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next slide"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                {ravoraSlides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === current
                        ? "w-8 bg-[color:var(--color-primary)]"
                        : "w-1.5 bg-[color:var(--color-line-strong)] hover:bg-[color:var(--color-primary)]/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Thumb chapters */}
          <div className="grid gap-2 sm:grid-cols-3">
            {ravoraSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                  i === current
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary-tint)]"
                    : "border-[color:var(--color-line)] hover:border-[color:var(--color-line-strong)]"
                }`}
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                    i === current
                      ? "bg-[color:var(--color-primary)] text-white"
                      : "bg-[color:var(--color-bg-secondary)] text-[color:var(--color-text-secondary)]"
                  }`}
                >
                  <s.thumbIcon size={16} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="text-sm font-semibold text-[color:var(--color-text)]">
                    {s.thumbLabel}
                  </span>
                  <span className="truncate text-[11px] text-[color:var(--color-text-tertiary)]">
                    {s.thumbHint}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {deals.length > 0 && (
          <aside className="flex flex-col gap-4" aria-label="Hot deals">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Hot deals</span>
              <Link
                href="/catalog?onSale=true"
                className="text-xs font-semibold text-[color:var(--color-primary)] hover:text-[color:var(--color-primary-hover)]"
              >
                See all
              </Link>
            </div>
            {deals.slice(0, 2).map((deal) => (
              <Link
                key={deal.id}
                href={deal.linkUrl || "/catalog"}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-4 transition-colors hover:border-[color:var(--color-line-strong)]"
              >
                {deal.discountText && (
                  <span className="absolute left-3 top-3 inline-flex h-6 items-center rounded-full bg-[color:var(--color-accent)] px-2.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    {deal.discountText}
                  </span>
                )}
                <div className="mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-[color:var(--color-bg)]">
                  {deal.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={deal.imageUrl}
                      alt={deal.title}
                      className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="block h-full w-full bg-[color:var(--color-bg-secondary)]" />
                  )}
                </div>
                <h4 className="line-clamp-2 text-sm font-medium text-[color:var(--color-text)]">
                  {deal.title}
                </h4>
                <div className="mt-2 flex items-baseline gap-2">
                  {deal.oldPrice && (
                    <span className="text-xs text-[color:var(--color-text-tertiary)] line-through">
                      {deal.oldPrice}
                    </span>
                  )}
                  {deal.newPrice && (
                    <span className="text-base font-semibold text-[color:var(--color-accent)]">
                      {deal.newPrice}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </aside>
        )}
      </div>
    </section>
  );
}
