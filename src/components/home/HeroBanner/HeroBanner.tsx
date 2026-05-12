"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./HeroBanner.module.css";

interface Slide {
  titleKey: string;
  subtitleKey: string;
  ctaHref: string;
  ctaKey: string;
  secondaryCtaHref?: string;
  secondaryCtaKey?: string;
  badge?: string;
}

const slides: Slide[] = [
  {
    badge: "New Season Collection",
    titleKey: "heroTitle",
    subtitleKey: "heroSubtitle",
    ctaHref: "/catalog",
    ctaKey: "heroCta",
    secondaryCtaHref: "/catalog?sort=newest",
    secondaryCtaKey: "heroExplore",
  },
  {
    badge: "Limited Time Offer",
    titleKey: "heroSale",
    subtitleKey: "heroSaleSubtitle",
    ctaHref: "/catalog?onSale=true",
    ctaKey: "heroShopSale",
  },
  {
    badge: "Just Arrived",
    titleKey: "heroNew",
    subtitleKey: "heroNewSubtitle",
    ctaHref: "/catalog?sort=newest",
    ctaKey: "heroExplore",
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

  return (
    <section className={styles.hero}>
      {/* Floating decorative objects */}
      <div className={styles.floatingObjects}>
        <div className={`${styles.floatObj} ${styles.floatObj1}`} />
        <div className={`${styles.floatObj} ${styles.floatObj2}`} />
        <div className={`${styles.floatObj} ${styles.floatObj3}`} />
        <div className={`${styles.floatObj} ${styles.floatObj4}`} />
        <div className={`${styles.floatObj} ${styles.floatObj5}`} />
      </div>

      {/* Decorative floating cards */}
      <div className={styles.decoCard}>
        <span className={styles.decoCardLabel}>Products</span>
        <span className={styles.decoCardValue}>500+</span>
        <span className={styles.decoCardLabel}>in catalog</span>
      </div>

      <div className={styles.decoCard2}>
        <div className={styles.decoStars}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
        <span className={styles.decoReviewText}>4.9 avg rating</span>
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className={styles.textBlock}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {slide.badge && (
              <motion.div
                className={styles.badge}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles size={14} />
                {slide.badge}
              </motion.div>
            )}

            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {t(slide.titleKey).split(" ").map((word, i, arr) =>
                i >= arr.length - 2 ? (
                  <span key={i} className={styles.titleGradient}>
                    {word}{" "}
                  </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </motion.h1>

            <motion.p
              className={styles.subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              {t(slide.subtitleKey)}
            </motion.p>

            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <Link href={slide.ctaHref} className={styles.ctaPrimary}>
                {t(slide.ctaKey)} <ArrowRight size={16} />
              </Link>
              {slide.secondaryCtaHref && slide.secondaryCtaKey && (
                <Link href={slide.secondaryCtaHref} className={styles.ctaSecondary}>
                  {t(slide.secondaryCtaKey)}
                </Link>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous slide">
        <ChevronLeft size={20} />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next slide">
        <ChevronRight size={20} />
      </button>

      <div className={styles.indicators}>
        {slides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
