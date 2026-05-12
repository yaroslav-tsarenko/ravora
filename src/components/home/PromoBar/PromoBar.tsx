"use client";

import { useTranslations } from "next-intl";
import { Truck, RotateCcw, Headphones, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./PromoBar.module.css";

const promos = [
  { icon: <Truck size={22} />, titleKey: "promoFreeShipping" as const, descKey: "promoFreeShippingDesc" as const },
  { icon: <RotateCcw size={22} />, titleKey: "promoReturns" as const, descKey: "promoReturnsDesc" as const },
  { icon: <Headphones size={22} />, titleKey: "promoSupport" as const, descKey: "promoSupportDesc" as const },
  { icon: <ShieldCheck size={22} />, titleKey: "promoSecure" as const, descKey: "promoSecureDesc" as const },
];

export function PromoBar() {
  const t = useTranslations("home");

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {promos.map((promo, i) => (
          <motion.div
            key={promo.titleKey}
            className={styles.item}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <div className={styles.iconWrap}>{promo.icon}</div>
            <div>
              <p className={styles.title}>{t(promo.titleKey)}</p>
              <p className={styles.desc}>{t(promo.descKey)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
