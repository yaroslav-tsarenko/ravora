"use client";

import { Link } from "@/i18n/routing";
import styles from "./PromoBannerGrid.module.css";

const smallBanners = [
  {
    label: "Smartphones",
    title: "New Season, New Phone",
    subtitle: "From €299",
    bg: "#F0F4FF",
    accent: "#2196F3",
    href: "/catalog/electronics",
  },
  {
    label: "Home & Kitchen",
    title: "Upgrade Your Kitchen",
    subtitle: "Up to 30% off",
    bg: "#FFF8F0",
    accent: "#FF9800",
    href: "/catalog/home-garden",
  },
  {
    label: "Gaming",
    title: "Level Up Your Setup",
    subtitle: "From €49.99",
    bg: "#F0FFF4",
    accent: "#4CAF50",
    href: "/catalog/electronics",
  },
];

const wideBanner = {
  label: "Member Exclusive",
  title: "Join Our Club & Get 10% Off Your First Order",
  subtitle: "Free shipping on all orders, early access to sales, and member-only deals",
  bg: "#1A1A2E",
  accent: "#E53935",
  color: "#fff",
  href: "/auth/register",
  cta: "Join Free",
};

export function PromoBannerGrid() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {smallBanners.map((b) => (
          <Link key={b.title} href={b.href} className={styles.small} style={{ background: b.bg }}>
            <span className={styles.label} style={{ color: b.accent }}>{b.label}</span>
            <h3 className={styles.smallTitle}>{b.title}</h3>
            <span className={styles.subtitle}>{b.subtitle}</span>
            <span className={styles.link} style={{ color: b.accent }}>Shop now &rarr;</span>
          </Link>
        ))}
      </div>
      <Link
        href={wideBanner.href}
        className={styles.wide}
        style={{ background: wideBanner.bg, color: wideBanner.color }}
      >
        <div className={styles.wideContent}>
          <span className={styles.wideLabel} style={{ background: wideBanner.accent }}>
            {wideBanner.label}
          </span>
          <h3 className={styles.wideTitle}>{wideBanner.title}</h3>
          <p className={styles.wideSubtitle}>{wideBanner.subtitle}</p>
        </div>
        <span className={styles.wideCta} style={{ background: wideBanner.accent }}>
          {wideBanner.cta}
        </span>
      </Link>
    </div>
  );
}
