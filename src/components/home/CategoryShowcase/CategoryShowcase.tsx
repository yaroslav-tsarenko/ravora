"use client";

import { Link } from "@/i18n/routing";
import {
  Monitor, Shirt, Home, Dumbbell, Smartphone, Laptop, Headphones,
  Camera, Watch, ShoppingBag, Footprints, Sofa, Wrench, Bike, Package,
} from "lucide-react";
import styles from "./CategoryShowcase.module.css";

const ICON_MAP: Record<string, React.ElementType> = {
  electronics: Monitor,
  clothing: Shirt,
  "home-garden": Home,
  sports: Dumbbell,
  smartphones: Smartphone,
  "laptops-computers": Laptop,
  "audio-headphones": Headphones,
  "cameras-photography": Camera,
  "wearable-tech": Watch,
  "bags-accessories": ShoppingBag,
  "shoes-footwear": Footprints,
  furniture: Sofa,
  "garden-outdoor": Wrench,
  cycling: Bike,
};

const COLOR_MAP: Record<string, string> = {
  electronics: "#EDE9FE",
  clothing: "#FCE7F3",
  "home-garden": "#DCFCE7",
  sports: "#FEF3C7",
  smartphones: "#DBEAFE",
  "laptops-computers": "#E0E7FF",
  "audio-headphones": "#F3E8FF",
  "cameras-photography": "#FEE2E2",
  "wearable-tech": "#CFFAFE",
  "bags-accessories": "#FFF7ED",
  "shoes-footwear": "#FCE7F3",
  furniture: "#ECFDF5",
  "garden-outdoor": "#F0FDF4",
  cycling: "#FEF9C3",
};

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
  if (categories.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Shop by Category</h2>
      </div>
      <div className={styles.grid}>
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.slug] || Package;
          const bg = COLOR_MAP[cat.slug] || "#F3F4F6";
          return (
            <Link key={cat.id} href={`/catalog/${cat.slug}`} className={styles.card}>
              <div className={styles.iconWrap} style={{ background: bg }}>
                <Icon size={22} />
              </div>
              <div className={styles.info}>
                <h3 className={styles.cardName}>{cat.name}</h3>
                <span className={styles.cardCount}>{cat.productCount} products</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
