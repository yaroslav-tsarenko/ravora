"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  Monitor, Smartphone, Gamepad2, Tv, Cpu, Home, Sparkles,
  Dumbbell, Wrench, Sofa, Baby, Car, Shirt, Tag, ChevronRight, Menu, X
} from "lucide-react";
import styles from "./CategorySidebar.module.css";

const categories = [
  { name: "Computers & Office", slug: "electronics", icon: Monitor },
  { name: "Phones & Tablets", slug: "electronics", icon: Smartphone },
  { name: "Gaming", slug: "electronics", icon: Gamepad2 },
  { name: "TV, Audio & Video", slug: "electronics", icon: Tv },
  { name: "Computer Components", slug: "electronics", icon: Cpu },
  { name: "Home Appliances", slug: "home-garden", icon: Home },
  { name: "Beauty & Health", slug: "clothing", icon: Sparkles },
  { name: "Sports & Fitness", slug: "sports", icon: Dumbbell },
  { name: "Garden & Tools", slug: "home-garden", icon: Wrench },
  { name: "Furniture", slug: "home-garden", icon: Sofa },
  { name: "Kids & Baby", slug: "clothing", icon: Baby },
  { name: "Auto Goods", slug: "sports", icon: Car },
  { name: "Clothing & Accessories", slug: "clothing", icon: Shirt },
  { name: "Outlet", slug: "electronics", icon: Tag },
];

export function CategorySidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(true)}
        aria-label="Open categories"
      >
        <Menu size={20} />
        <span>Categories</span>
      </button>

      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <Menu size={16} />
            Catalog
          </h3>
          <button
            className={styles.closeBtn}
            onClick={() => setMobileOpen(false)}
            aria-label="Close categories"
          >
            <X size={20} />
          </button>
        </div>
        <nav className={styles.list}>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/catalog/${cat.slug}`}
              className={styles.item}
              onClick={() => setMobileOpen(false)}
            >
              <cat.icon size={16} className={styles.icon} />
              <span className={styles.name}>{cat.name}</span>
              <ChevronRight size={14} className={styles.arrow} />
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
