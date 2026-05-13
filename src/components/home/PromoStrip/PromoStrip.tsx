"use client";

import {
  Truck, RotateCcw, Shield, Gift, Award, Headphones,
  Zap, Heart, Star, Package, Clock, CheckCircle,
} from "lucide-react";
import styles from "./PromoStrip.module.css";

const ICON_MAP: Record<string, React.ElementType> = {
  Truck, RotateCcw, Shield, Gift, Award, Headphones,
  Zap, Heart, Star, Package, Clock, CheckCircle,
};

interface PromoItem {
  id: string;
  icon: string;
  title: string;
  subtitle?: string | null;
  linkUrl?: string | null;
}

interface Props {
  items: PromoItem[];
}

const defaultItems: PromoItem[] = [
  { id: "1", icon: "Truck", title: "Free Delivery", subtitle: "Orders over €50" },
  { id: "2", icon: "RotateCcw", title: "Easy Returns", subtitle: "30-day policy" },
  { id: "3", icon: "Shield", title: "2-Year Warranty", subtitle: "On all products" },
  { id: "4", icon: "Gift", title: "Gift Cards", subtitle: "Available now" },
  { id: "5", icon: "Award", title: "Premium Quality", subtitle: "Certified goods" },
  { id: "6", icon: "Headphones", title: "24/7 Support", subtitle: "Always here" },
];

export function PromoStrip({ items }: Props) {
  const data = items.length > 0 ? items : defaultItems;

  return (
    <div className={styles.strip}>
      <div className={styles.container}>
        {data.map((b) => {
          const Icon = ICON_MAP[b.icon] || Package;
          return (
            <div key={b.id} className={styles.item}>
              <Icon size={18} className={styles.icon} />
              <div className={styles.text}>
                <span className={styles.label}>{b.title}</span>
                {b.subtitle && <span className={styles.sub}>{b.subtitle}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
