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

const defaultSmall: BannerData[] = [
  { id: "1", badgeText: "Smartphones", title: "New Season, New Phone", subtitle: "From €299", bgColor: "#F0F4FF", textColor: "#1A1A2E", linkUrl: "/catalog/electronics" },
  { id: "2", badgeText: "Home & Kitchen", title: "Upgrade Your Kitchen", subtitle: "Up to 30% off", bgColor: "#FFF8F0", textColor: "#1A1A2E", linkUrl: "/catalog/home-garden" },
  { id: "3", badgeText: "Gaming", title: "Level Up Your Setup", subtitle: "From €49.99", bgColor: "#F0FFF4", textColor: "#1A1A2E", linkUrl: "/catalog/electronics" },
];

const defaultWide: BannerData[] = [
  { id: "w1", badgeText: "Member Exclusive", title: "Join Our Club & Get 10% Off", subtitle: "Free shipping, early access, member-only deals", bgColor: "#1A1A2E", textColor: "#ffffff", linkUrl: "/auth/register", ctaLabel: "Join Free" },
];

export function PromoBannerGrid({ smallBanners, wideBanners }: Props) {
  const small = smallBanners.length > 0 ? smallBanners : defaultSmall;
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
