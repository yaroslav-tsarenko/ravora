"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import styles from "./HeroCarousel.module.css";

const slides = [
  {
    badge: "Hot Deal",
    title: "Summer Electronics Sale",
    subtitle: "Up to 40% off on laptops, tablets, and accessories",
    cta: "Shop Now",
    href: "/catalog/electronics",
    bg: "#1A1A2E",
    accent: "#E53935",
    color: "#fff",
  },
  {
    badge: "New Arrival",
    title: "Smart Home Collection",
    subtitle: "Transform your home with the latest smart devices",
    cta: "Explore",
    href: "/catalog/home-garden",
    bg: "#F5F5F5",
    accent: "#4CAF50",
    color: "#1A1A2E",
  },
  {
    badge: "Limited Time",
    title: "Gaming Gear Festival",
    subtitle: "Top brands, best prices. Keyboards, mice, headsets & more",
    cta: "View Deals",
    href: "/catalog/electronics",
    bg: "#0D1B2A",
    accent: "#FF9800",
    color: "#fff",
  },
];

const deals = [
  {
    title: "Wireless Earbuds Pro",
    oldPrice: "€129.99",
    newPrice: "€79.99",
    discount: "-38%",
    href: "/catalog/electronics",
  },
  {
    title: "4K Action Camera",
    oldPrice: "€249.99",
    newPrice: "€169.99",
    discount: "-32%",
    href: "/catalog/electronics",
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <div className={styles.heroArea}>
      <div className={styles.carousel}>
        <div
          className={styles.slide}
          style={{ background: slide.bg, color: slide.color }}
        >
          <div className={styles.slideContent}>
            <span className={styles.badge} style={{ background: slide.accent }}>
              {slide.badge}
            </span>
            <h2 className={styles.slideTitle}>{slide.title}</h2>
            <p className={styles.slideSubtitle}>{slide.subtitle}</p>
            <Link
              href={slide.href}
              className={styles.slideCta}
              style={{ background: slide.accent }}
            >
              {slide.cta}
            </Link>
          </div>
        </div>

        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous slide">
          <ChevronLeft size={20} />
        </button>
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next slide">
          <ChevronRight size={20} />
        </button>

        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.sideDeals}>
        {deals.map((deal) => (
          <Link key={deal.title} href={deal.href} className={styles.dealCard}>
            <span className={styles.dealDiscount}>{deal.discount}</span>
            <div className={styles.dealImage}>
              <div className={styles.dealImagePlaceholder} />
            </div>
            <h4 className={styles.dealTitle}>{deal.title}</h4>
            <div className={styles.dealPrices}>
              <span className={styles.dealOld}>{deal.oldPrice}</span>
              <span className={styles.dealNew}>{deal.newPrice}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
