"use client";

import { useRef } from "react";
import { Link } from "@/i18n/routing";
import { motion, useInView } from "framer-motion";
import { Package } from "lucide-react";
import styles from "./CategoryShowcase.module.css";

const COLORS = [
  "#EDE9FE", "#FCE7F3", "#DCFCE7", "#FEF3C7",
  "#DBEAFE", "#E0E7FF", "#F3E8FF", "#FEE2E2",
  "#CFFAFE", "#FFF7ED", "#ECFDF5", "#FEF9C3",
];

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  productCount: number;
}

interface Props {
  categories: CategoryItem[];
}

export function CategoryShowcase({ categories }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  if (categories.length === 0) return null;

  return (
    <section ref={ref} className={styles.section}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.title}>Shop by Category</h2>
      </motion.div>
      <div className={styles.grid}>
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <Link href={`/catalog/${cat.slug}`} className={styles.card}>
              <div className={styles.iconWrap} style={{ background: COLORS[i % COLORS.length] }}>
                <Package size={22} />
              </div>
              <div className={styles.info}>
                <h3 className={styles.cardName}>{cat.name}</h3>
                <span className={styles.cardCount}>{cat.productCount} products</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
