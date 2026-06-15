"use client";

import { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
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

interface DefaultSlide {
  id: string;
  badgeText: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  linkUrl: string;
  bgColor: string;
  textColor: string;
  bgImage: StaticImageData;
}

const defaultSlides: DefaultSlide[] = [
  {
    id: "1",
    badgeText: "Professional Grade",
    title: "Switchgear & Distribution Boards",
    subtitle: "Certified panels, circuit breakers, and modular enclosures for residential and commercial installations",
    ctaLabel: "Shop Now",
    linkUrl: "/catalog",
    bgColor: "#073B66",
    textColor: "#ffffff",
    bgImage: banner1,
  },
  {
    id: "2",
    badgeText: "Complete Range",
    title: "Industrial Control & Automation",
    subtitle: "From compact enclosures to full-size distribution cabinets — everything for your next project",
    ctaLabel: "Browse Equipment",
    linkUrl: "/catalog",
    bgColor: "#073B66",
    textColor: "#ffffff",
    bgImage: banner2,
  },
  {
    id: "3",
    badgeText: "Top Quality",
    title: "Cables, Wiring & Connectors",
    subtitle: "Premium copper cables, flexible wiring, terminal blocks and accessories at wholesale prices",
    ctaLabel: "View Cables",
    linkUrl: "/catalog",
    bgColor: "#073B66",
    textColor: "#ffffff",
    bgImage: banner3,
  },
];

const bgImageMap: Record<string, StaticImageData> = {
  "1": banner1,
  "2": banner2,
  "3": banner3,
};

interface Props {
  slides: SlideData[];
  deals: DealData[];
}

export function HeroCarousel({ slides, deals }: Props) {
  const useDefaults = slides.length === 0;
  const activeSlides = useDefaults ? defaultSlides : slides;
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
  const bgImage = useDefaults
    ? (slide as DefaultSlide).bgImage
    : bgImageMap[slide.id] || null;

  return (
    <div className={styles.heroArea}>
      <div className={styles.heroInner}>
        <div className={styles.carousel}>
          <div
            className={styles.slide}
            style={bgImage ? { color: "#fff" } : { background: slide.bgColor, color: slide.textColor }}
          >
            {bgImage && (
              <>
                <Image
                  src={bgImage}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className={styles.bgImg}
                  priority={current === 0}
                />
                <div className={styles.overlay} />
              </>
            )}
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
    </div>
  );
}
