"use client";

import { useState, useMemo, useRef } from "react";
import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
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

interface TabInput {
  label: string;
  slugs: string[];
}

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  tabs?: TabInput[] | string[];
  bg?: "white" | "gray";
  columns?: number;
}

function normalizeTabs(tabs: Props["tabs"]): TabInput[] {
  if (!tabs || tabs.length === 0) return [];
  if (typeof tabs[0] === "string") {
    return (tabs as string[]).map((label) => ({ label, slugs: [] }));
  }
  return tabs as TabInput[];
}

export function ProductSection({
  title, subtitle, products, viewAllHref, viewAllLabel, tabs, bg = "white", columns = 5,
}: Props) {
  const normalizedTabs = useMemo(() => normalizeTabs(tabs), [tabs]);
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const filtered = useMemo(() => {
    if (normalizedTabs.length === 0 || activeTab === 0) return products;
    const tab = normalizedTabs[activeTab];
    if (!tab) return products;
    const slugSet = new Set(tab.slugs);
    if (slugSet.size > 0) {
      const matched = products.filter((p) =>
        p.categories?.some((c) => slugSet.has(c.category.slug))
      );
      return matched.length > 0 ? matched : products;
    }
    const matched = products.filter((p) =>
      p.categories?.some((c) => c.category.name === tab.label)
    );
    return matched.length > 0 ? matched : products;
  }, [products, normalizedTabs, activeTab]);

  if (!products.length) return null;

  return (
    <section ref={ref} className={`${styles.section} ${bg === "gray" ? styles.gray : ""}`}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
        {normalizedTabs.length > 1 && (
          <div className={styles.tabs}>
            {normalizedTabs.map((tab, i) => (
              <button
                key={tab.label}
                className={`${styles.tab} ${i === activeTab ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        {viewAllHref && (
          <Link href={viewAllHref} className={styles.viewAll}>
            {viewAllLabel || "View all"} <ChevronRight size={14} />
          </Link>
        )}
      </motion.div>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: Math.min(i * 0.07, 0.5) }}
          >
            <MarketplaceProductCard product={p} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
