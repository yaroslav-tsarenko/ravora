"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./BrandStrip.module.css";

const brands = [
  "Apple", "Samsung", "Sony", "LG", "Xiaomi",
  "Lenovo", "ASUS", "Dyson", "Bosch", "Philips",
  "JBL", "LEGO", "Nike", "Electrolux", "Canon",
];

export function BrandStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

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
          <div key={brand} className={styles.brand}>
            <span className={styles.brandName}>{brand}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
