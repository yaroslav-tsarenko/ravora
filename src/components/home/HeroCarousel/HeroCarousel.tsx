"use client";

import { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import {
  ChevronLeft, ChevronRight, ArrowRight, Truck, ShieldCheck,
  RotateCcw, Zap, Headphones, Watch, BatteryCharging,
  Sparkles,
} from "lucide-react";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";
import styles from "./HeroCarousel.module.css";

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

interface NetimSlide {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  gradient: string;
  accent: string;
  bgImage: StaticImageData;
  thumbLabel: string;
  thumbIcon: React.ElementType;
}

const netimSlides: NetimSlide[] = [
  {
    id: "audio",
    eyebrow: "Audio · This week's pick",
    title: (
      <>
        Sound that goes
        <br />
        <span className="hero-highlight">where you go.</span>
      </>
    ),
    subtitle:
      "Wireless headphones, soundbars and Hi-Fi gear from T'NB, Belkin, Trust and more — shipped from our EU warehouse.",
    primaryCta: { label: "Shop audio", href: "/catalog/audio-and-hi-fi-equipment" },
    secondaryCta: { label: "Top headphones", href: "/catalog/headphones" },
    gradient: "linear-gradient(135deg, #0B2447 0%, #1E3A6F 45%, #2563EB 100%)",
    accent: "#F97316",
    bgImage: banner1,
    thumbLabel: "Audio",
    thumbIcon: Headphones,
  },
  {
    id: "power",
    eyebrow: "Power & connectivity",
    title: (
      <>
        Stay charged. Stay
        <br />
        <span className="hero-highlight">connected.</span>
      </>
    ),
    subtitle:
      "Chargers, batteries, multi-socket adapters and power strips you can rely on — engineered for daily use.",
    primaryCta: { label: "Shop power", href: "/catalog/batteries-and-chargers" },
    secondaryCta: { label: "Multi-socket adapters", href: "/catalog/power-strips" },
    gradient: "linear-gradient(135deg, #0F172A 0%, #1F2937 50%, #064E3B 100%)",
    accent: "#10B981",
    bgImage: banner2,
    thumbLabel: "Power",
    thumbIcon: BatteryCharging,
  },
  {
    id: "smart",
    eyebrow: "Smart gear · New arrivals",
    title: (
      <>
        Smart tech for
        <br />
        <span className="hero-highlight">every day.</span>
      </>
    ),
    subtitle:
      "Smartwatches, GPS, action cameras and gaming accessories — curated for the way you actually live and work.",
    primaryCta: { label: "Browse new arrivals", href: "/catalog?sort=newest" },
    secondaryCta: { label: "Smart watches", href: "/catalog?search=watch" },
    gradient: "linear-gradient(135deg, #1E1B4B 0%, #4C1D95 50%, #7C3AED 100%)",
    accent: "#FACC15",
    bgImage: banner3,
    thumbLabel: "Smart",
    thumbIcon: Watch,
  },
];

const trustItems = [
  { icon: Truck, label: "Free EU shipping", sub: "Over €100" },
  { icon: RotateCcw, label: "30-day returns", sub: "No questions" },
  { icon: ShieldCheck, label: "2-year warranty", sub: "Every product" },
  { icon: Zap, label: "Same-day dispatch", sub: "Before 14:00 CET" },
];

interface Props {
  slides: SlideData[];
  deals: DealData[];
}

export function HeroCarousel({ deals }: Props) {
  // We always use NetimStore-tailored slides for the hero.
  // Admin-configured slides (`slides` prop) are intentionally ignored here —
  // they belong on dedicated marketing landing pages, not the brand hero.
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const slide = netimSlides[current];

  const go = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(((idx % netimSlides.length) + netimSlides.length) % netimSlides.length);
    },
    [current]
  );

  const next = useCallback(() => go(current + 1), [current, go]);
  const prev = useCallback(() => go(current - 1), [current, go]);

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setCurrent((p) => (p + 1) % netimSlides.length);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={styles.hero} aria-label="Featured collections">
      <div className={`${styles.heroContainer} ${deals.length > 0 ? styles.withDeals : ""}`}>
        <div className={styles.heroMain}>
          <div className={styles.stage} style={{ background: slide.gradient }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${slide.id}-bg`}
                className={styles.bgImageWrap}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                aria-hidden="true"
              >
                <Image
                  src={slide.bgImage}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 1280px"
                  placeholder="blur"
                  className={styles.bgImage}
                  priority
                />
                <span className={styles.bgOverlay} />
                <span className={styles.glow1} style={{ background: slide.accent }} />
                <span className={styles.glow2} />
                <span className={styles.gridDots} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={slide.id}
                className={styles.slide}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.copy}>
                  <span
                    className={styles.eyebrow}
                    style={{ borderColor: slide.accent + "55", color: slide.accent }}
                  >
                    <Sparkles size={14} />
                    {slide.eyebrow}
                  </span>
                  <h1 className={styles.title}>{slide.title}</h1>
                  <p className={styles.subtitle}>{slide.subtitle}</p>

                  <div className={styles.actions}>
                    <Link
                      href={slide.primaryCta.href}
                      className={styles.ctaPrimary}
                      style={{
                        background: slide.accent,
                        boxShadow: `0 12px 28px -10px ${slide.accent}`,
                      }}
                    >
                      {slide.primaryCta.label}
                      <ArrowRight size={16} />
                    </Link>
                    {slide.secondaryCta && (
                      <Link href={slide.secondaryCta.href} className={styles.ctaSecondary}>
                        {slide.secondaryCta.label}
                      </Link>
                    )}
                  </div>

                  <ul className={styles.trust}>
                    {trustItems.map((t) => (
                      <li key={t.label} className={styles.trustItem}>
                        <span className={styles.trustIcon}>
                          <t.icon size={14} />
                        </span>
                        <span className={styles.trustText}>
                          <span className={styles.trustLabel}>{t.label}</span>
                          <span className={styles.trustSub}>{t.sub}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.visual} aria-hidden="true">
                  <motion.div
                    className={styles.priceTag}
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.55, delay: 0.25 }}
                  >
                    <span className={styles.priceTagFrom}>From</span>
                    <span className={styles.priceTagPrice}>€8.29</span>
                    <span className={styles.priceTagSub}>In stock today</span>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className={styles.controls}>
              <button
                type="button"
                className={styles.arrow}
                onClick={prev}
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <div className={styles.dots}>
                {netimSlides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                    onClick={() => go(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    style={i === current ? { background: slide.accent } : undefined}
                  />
                ))}
              </div>
              <button
                type="button"
                className={styles.arrow}
                onClick={next}
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className={styles.thumbs}>
            {netimSlides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                className={`${styles.thumb} ${i === current ? styles.thumbActive : ""}`}
              >
                <span className={styles.thumbIcon}>
                  <s.thumbIcon size={16} />
                </span>
                <span className={styles.thumbMeta}>
                  <span className={styles.thumbLabel}>{s.thumbLabel}</span>
                  <span className={styles.thumbHint}>{s.eyebrow.split("·")[0].trim()}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {deals.length > 0 && (
          <aside className={styles.sideDeals} aria-label="Hot deals">
            <div className={styles.sideHeading}>
              <span className={styles.sideHeadingText}>Hot deals</span>
              <Link href="/catalog?onSale=true" className={styles.sideHeadingLink}>
                See all
              </Link>
            </div>
            {deals.slice(0, 2).map((deal) => (
              <Link
                key={deal.id}
                href={deal.linkUrl || "/catalog"}
                className={styles.dealCard}
              >
                {deal.discountText && (
                  <span className={styles.dealDiscount}>{deal.discountText}</span>
                )}
                <div className={styles.dealImage}>
                  {deal.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={deal.imageUrl} alt={deal.title} className={styles.dealImg} />
                  ) : (
                    <div className={styles.dealImagePlaceholder} />
                  )}
                </div>
                <h4 className={styles.dealTitle}>{deal.title}</h4>
                <div className={styles.dealPrices}>
                  {deal.oldPrice && <span className={styles.dealOld}>{deal.oldPrice}</span>}
                  {deal.newPrice && <span className={styles.dealNew}>{deal.newPrice}</span>}
                </div>
              </Link>
            ))}
          </aside>
        )}
      </div>
    </section>
  );
}
