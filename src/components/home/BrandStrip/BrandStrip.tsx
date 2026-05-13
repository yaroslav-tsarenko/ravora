"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./BrandStrip.module.css";

interface BrandData {
  id: string;
  name: string;
  logoUrl?: string | null;
  linkUrl?: string | null;
}

interface Props {
  brands: BrandData[];
}

export function BrandStrip({ brands }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  if (!brands.length) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Popular Brands</h3>
        <div className={styles.arrows}>
          <button className={styles.arrow} onClick={() => scroll(-1)} aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button className={styles.arrow} onClick={() => scroll(1)} aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className={styles.track} ref={scrollRef}>
        {brands.map((brand) => (
          <a key={brand.id} href={brand.linkUrl || "#"} className={styles.brand}>
            {brand.logoUrl ? (
              <img src={brand.logoUrl} alt={brand.name} className={styles.brandLogo} />
            ) : (
              <span className={styles.brandName}>{brand.name}</span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
