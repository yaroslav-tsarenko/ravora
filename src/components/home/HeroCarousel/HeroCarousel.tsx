"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
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

const defaultSlides: SlideData[] = [
  { id: "1", badgeText: "Hot Deal", title: "Summer Electronics Sale", subtitle: "Up to 40% off on laptops, tablets, and accessories", ctaLabel: "Shop Now", linkUrl: "/catalog/electronics", bgColor: "#1A1A2E", textColor: "#ffffff" },
  { id: "2", badgeText: "New Arrival", title: "Smart Home Collection", subtitle: "Transform your home with the latest smart devices", ctaLabel: "Explore", linkUrl: "/catalog/home-garden", bgColor: "#F5F5F5", textColor: "#1A1A2E" },
  { id: "3", badgeText: "Limited Time", title: "Gaming Gear Festival", subtitle: "Top brands, best prices", ctaLabel: "View Deals", linkUrl: "/catalog/electronics", bgColor: "#0D1B2A", textColor: "#ffffff" },
];

interface Props {
  slides: SlideData[];
  deals: DealData[];
}

export function HeroCarousel({ slides, deals }: Props) {
  const activeSlides = slides.length > 0 ? slides : defaultSlides;
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, activeSlides.length]);

  const slide = activeSlides[current];

  return (
    <div className={styles.heroArea}>
      <div className={styles.carousel}>
        <div
          className={styles.slide}
          style={{ background: slide.bgColor, color: slide.textColor }}
        >
          <div className={styles.slideContent}>
            {slide.badgeText && (
              <span className={styles.badge}>{slide.badgeText}</span>
            )}
            <h2 className={styles.slideTitle}>{slide.title}</h2>
            {slide.subtitle && <p className={styles.slideSubtitle}>{slide.subtitle}</p>}
            {slide.linkUrl && (
              <Link href={slide.linkUrl} className={styles.slideCta}>
                {slide.ctaLabel || "Shop Now"}
              </Link>
            )}
          </div>
        </div>

        {activeSlides.length > 1 && (
          <>
            <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous slide">
              <ChevronLeft size={20} />
            </button>
            <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next slide">
              <ChevronRight size={20} />
            </button>
            <div className={styles.dots}>
              {activeSlides.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {deals.length > 0 && (
        <div className={styles.sideDeals}>
          {deals.map((deal) => (
            <Link key={deal.id} href={deal.linkUrl || "/catalog"} className={styles.dealCard}>
              {deal.discountText && (
                <span className={styles.dealDiscount}>{deal.discountText}</span>
              )}
              <div className={styles.dealImage}>
                {deal.imageUrl ? (
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
        </div>
      )}
    </div>
  );
}
