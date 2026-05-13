"use client";

import { useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { MarketplaceProductCard } from "../MarketplaceProductCard/MarketplaceProductCard";
import styles from "./ProductSection.module.css";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  comparePrice?: number | string | null;
  images: { url: string; alt?: string | null }[];
  categories?: { category: { name: string; slug: string } }[];
  quantity?: number;
  status?: string;
  isFeatured?: boolean;
  brand?: string | null;
}

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  tabs?: string[];
  bg?: "white" | "gray";
  columns?: number;
}

export function ProductSection({
  title, subtitle, products, viewAllHref, viewAllLabel, tabs, bg = "white", columns = 5,
}: Props) {
  const [activeTab, setActiveTab] = useState(0);

  const filtered = useMemo(() => {
    if (!tabs || tabs.length === 0 || activeTab === 0) return products;
    const tabName = tabs[activeTab];
    return products.filter((p) =>
      p.categories?.some((c) => c.category.name === tabName)
    );
  }, [products, tabs, activeTab]);

  if (!products.length) return null;

  return (
    <section className={`${styles.section} ${bg === "gray" ? styles.gray : ""}`}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
        {tabs && tabs.length > 1 && (
          <div className={styles.tabs}>
            {tabs.map((tab, i) => (
              <button
                key={tab}
                className={`${styles.tab} ${i === activeTab ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
        {viewAllHref && (
          <Link href={viewAllHref} className={styles.viewAll}>
            {viewAllLabel || "View all"} <ChevronRight size={14} />
          </Link>
        )}
      </div>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {filtered.map((p) => (
          <MarketplaceProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
