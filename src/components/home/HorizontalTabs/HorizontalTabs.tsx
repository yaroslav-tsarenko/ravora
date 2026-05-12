"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Flame, Apple, Wind, Gift, Smartphone, Gamepad2, Lightbulb, Sparkles, Tag } from "lucide-react";
import styles from "./HorizontalTabs.module.css";

const tabs = [
  { label: "Offers", icon: Flame, href: "/catalog", color: "#E53935" },
  { label: "Apple Store", icon: Apple, href: "/catalog/electronics", color: "#333" },
  { label: "Dyson Store", icon: Wind, href: "/catalog/home-garden", color: "#6C5CE7" },
  { label: "Get Bonus", icon: Gift, href: "/catalog", color: "#FF9800" },
  { label: "Mobile App", icon: Smartphone, href: "/catalog/electronics", color: "#2196F3" },
  { label: "Gaming World", icon: Gamepad2, href: "/catalog/electronics", color: "#4CAF50" },
  { label: "Tips", icon: Lightbulb, href: "/faq", color: "#FF9800" },
  { label: "New Arrivals", icon: Sparkles, href: "/catalog", color: "#9C27B0" },
  { label: "Outlet", icon: Tag, href: "/catalog", color: "#E53935" },
];

export function HorizontalTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {tabs.map((tab, i) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`${styles.tab} ${i === active ? styles.active : ""}`}
            onClick={() => setActive(i)}
          >
            <tab.icon size={15} style={{ color: tab.color }} />
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
