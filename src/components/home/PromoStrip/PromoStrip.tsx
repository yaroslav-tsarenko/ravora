"use client";

import { Truck, RotateCcw, Shield, Gift, Award, Headphones } from "lucide-react";
import styles from "./PromoStrip.module.css";

const benefits = [
  { icon: Truck, label: "Free Delivery", sub: "Orders over €50" },
  { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
  { icon: Shield, label: "2-Year Warranty", sub: "On all products" },
  { icon: Gift, label: "Gift Cards", sub: "Available now" },
  { icon: Award, label: "Premium Quality", sub: "Certified goods" },
  { icon: Headphones, label: "24/7 Support", sub: "Always here" },
];

export function PromoStrip() {
  return (
    <div className={styles.strip}>
      <div className={styles.container}>
        {benefits.map((b) => (
          <div key={b.label} className={styles.item}>
            <b.icon size={18} className={styles.icon} />
            <div className={styles.text}>
              <span className={styles.label}>{b.label}</span>
              <span className={styles.sub}>{b.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
