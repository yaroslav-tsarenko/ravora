"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { MapPin, Phone, Globe } from "lucide-react";
import styles from "./TopBar.module.css";

export function TopBar() {
  const t = useTranslations("nav");

  return (
    <div className={styles.topBar}>
      <div className={styles.container}>
        <nav className={styles.left}>
          <Link href="/about" className={styles.link}>About</Link>
          <Link href="/policies/terms" className={styles.link}>Payment</Link>
          <Link href="/faq" className={styles.link}>Delivery</Link>
          <Link href="/policies/returns" className={styles.link}>Returns</Link>
          <Link href="/faq" className={styles.link}>FAQ</Link>
          <Link href="/contact" className={styles.link}>Order Info</Link>
        </nav>
        <div className={styles.right}>
          <a href="#" className={styles.link}>
            <MapPin size={13} />
            <span>Pickup Points</span>
          </a>
          <Link href="/contact" className={styles.link}>
            <Phone size={13} />
            <span>Contacts</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
