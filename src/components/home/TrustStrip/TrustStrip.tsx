"use client";

import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import styles from "./TrustStrip.module.css";

const items = [
  { icon: Truck, label: "Free Shipping", desc: "On orders over €50", color: "#E8F5E9", iconColor: "#2E7D32" },
  { icon: ShieldCheck, label: "Secure Payment", desc: "100% protected checkout", color: "#E3F2FD", iconColor: "#1565C0" },
  { icon: RotateCcw, label: "Easy Returns", desc: "30-day return policy", color: "#FFF3E0", iconColor: "#E65100" },
  { icon: Headphones, label: "24/7 Support", desc: "We're always here to help", color: "#F3E5F5", iconColor: "#6A1B9A" },
];

export function TrustStrip() {
  return (
    <section className={styles.section}>
      {items.map((item) => (
        <div key={item.label} className={styles.item}>
          <div className={styles.iconWrap} style={{ background: item.color }}>
            <item.icon size={20} style={{ color: item.iconColor }} />
          </div>
          <div>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.desc}>{item.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
