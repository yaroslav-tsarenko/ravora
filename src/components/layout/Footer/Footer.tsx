"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import styles from "./Footer.module.css";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>Store</Link>
            <p className={styles.brandDesc}>
              Quality products, curated with care. We deliver the best shopping experience right to your door.
            </p>
            <div className={styles.socialRow}>
              <a href="#" className={styles.socialIcon} aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>
              <a href="#" className={styles.socialIcon} aria-label="Instagram" target="_blank" rel="noopener noreferrer">in</a>
              <a href="#" className={styles.socialIcon} aria-label="Twitter" target="_blank" rel="noopener noreferrer">x</a>
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Shop</h3>
            <ul className={styles.links}>
              <li><Link href="/catalog" className={styles.link}>{nav("catalog")}</Link></li>
              <li><Link href="/catalog?sort=newest" className={styles.link}>New Arrivals</Link></li>
              <li><Link href="/catalog?onSale=true" className={styles.link}>Sale</Link></li>
              <li><Link href="/catalog?sort=popular" className={styles.link}>Best Sellers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>{nav("account")}</h3>
            <ul className={styles.links}>
              <li><Link href="/auth/login" className={styles.link}>{nav("login")}</Link></li>
              <li><Link href="/account/orders" className={styles.link}>My Orders</Link></li>
              <li><Link href="/account/wishlist" className={styles.link}>Wishlist</Link></li>
              <li><Link href="/contact" className={styles.link}>{t("contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Info</h3>
            <ul className={styles.links}>
              <li><Link href="/policies/privacy" className={styles.link}>{t("privacy")}</Link></li>
              <li><Link href="/policies/terms" className={styles.link}>{t("terms")}</Link></li>
              <li><Link href="/policies/returns" className={styles.link}>{t("returns")}</Link></li>
              <li><Link href="/contact" className={styles.link}>Help Center</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            {t("copyright", { year: currentYear, storeName: "Store" })}
          </p>
          <div className={styles.paymentMethods}>
            <span className={styles.paymentBadge}>VISA</span>
            <span className={styles.paymentBadge}>MC</span>
            <span className={styles.paymentBadge}>AMEX</span>
            <span className={styles.paymentBadge}>PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
