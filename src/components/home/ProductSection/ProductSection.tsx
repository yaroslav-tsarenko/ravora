"use client";

import { useState } from "react";
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
  products: Product[];
  viewAllHref?: string;
  tabs?: string[];
  bg?: "white" | "gray";
  columns?: number;
}

export function ProductSection({ title, products, viewAllHref, tabs, bg = "white", columns = 5 }: Props) {
  const [activeTab, setActiveTab] = useState(0);

  if (!products.length) return null;

  return (
    <section className={`${styles.section} ${bg === "gray" ? styles.gray : ""}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {tabs && tabs.length > 0 && (
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
            View all <ChevronRight size={14} />
          </Link>
        )}
      </div>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {products.map((p) => (
          <MarketplaceProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
