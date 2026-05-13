"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  Monitor, Smartphone, Gamepad2, Tv, Cpu, Home, Sparkles,
  Dumbbell, Wrench, Sofa, Baby, Car, Shirt, Tag, ChevronRight, Menu, X
} from "lucide-react";
import styles from "./CategorySidebar.module.css";

const categories = [
  { name: "Electronics", slug: "electronics", icon: Monitor },
  { name: "Smartphones", slug: "smartphones", icon: Smartphone },
  { name: "Laptops & Computers", slug: "laptops-computers", icon: Cpu },
  { name: "Audio & Headphones", slug: "audio-headphones", icon: Tv },
  { name: "Wearable Technology", slug: "wearable-tech", icon: Gamepad2 },
  { name: "Clothing & Fashion", slug: "clothing", icon: Shirt },
  { name: "Shoes & Footwear", slug: "shoes-footwear", icon: Sparkles },
  { name: "Home & Garden", slug: "home-garden", icon: Home },
  { name: "Kitchen & Dining", slug: "kitchen-dining", icon: Wrench },
  { name: "Furniture", slug: "furniture", icon: Sofa },
  { name: "Garden & Outdoor", slug: "garden-outdoor", icon: Baby },
  { name: "Sports & Outdoors", slug: "sports", icon: Dumbbell },
  { name: "Fitness Equipment", slug: "fitness-equipment", icon: Car },
  { name: "Cycling", slug: "cycling", icon: Tag },
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
