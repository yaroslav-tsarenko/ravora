"use client";

import { Link } from "@/i18n/routing";
import styles from "./PromoBannerGrid.module.css";

interface BannerData {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  ctaLabel?: string | null;
  bgColor: string;
  textColor: string;
  badgeText?: string | null;
}

interface Props {
  smallBanners: BannerData[];
  wideBanners: BannerData[];
}

const defaultWide: BannerData[] = [
  { id: "w1", badgeText: "Pro Account", title: "Register & Get 10% Off Your First Order", subtitle: "Free shipping over €100, trade pricing, and priority support", bgColor: "#1A1A2E", textColor: "#ffffff", linkUrl: "/auth/register", ctaLabel: "Join Free" },
];

export function PromoBannerGrid({ smallBanners, wideBanners }: Props) {
  const small = smallBanners;
  const wide = wideBanners.length > 0 ? wideBanners : defaultWide;

  return (
    <div className={styles.wrapper}>
      {small.length > 0 && (
        <div className={styles.grid}>
          {small.map((b) => (
            <Link key={b.id} href={b.linkUrl || "#"} className={styles.small} style={{ background: b.bgColor, color: b.textColor }}>
              {b.badgeText && <span className={styles.label}>{b.badgeText}</span>}
              <h3 className={styles.smallTitle}>{b.title}</h3>
              {b.subtitle && <span className={styles.subtitle}>{b.subtitle}</span>}
              <span className={styles.link}>Shop now &rarr;</span>
            </Link>
          ))}
        </div>
      )}
      {wide.map((b) => (
        <Link
          key={b.id}
          href={b.linkUrl || "#"}
          className={styles.wide}
          style={{ background: b.bgColor, color: b.textColor }}
        >
          <div className={styles.wideContent}>
            {b.badgeText && <span className={styles.wideLabel}>{b.badgeText}</span>}
            <h3 className={styles.wideTitle}>{b.title}</h3>
            {b.subtitle && <p className={styles.wideSubtitle}>{b.subtitle}</p>}
          </div>
          {b.ctaLabel && <span className={styles.wideCta}>{b.ctaLabel}</span>}
        </Link>
      ))}
    </div>
  );
}
