"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import styles from "./PromoBanner.module.css";

export function PromoBanner() {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className={styles.grid}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/catalog?onSale=true" className={styles.card}>
              <div className={styles.cardBg1} />
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>Limited Offer</span>
                <h3 className={styles.cardTitle}>Up to 40% off</h3>
                <p className={styles.cardDesc}>Don&apos;t miss our biggest sale of the season</p>
                <span className={styles.cardCta}>
                  Shop now <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/catalog?sort=newest" className={styles.card}>
              <div className={styles.cardBg2} />
              <div className={styles.cardContent}>
                <span className={styles.cardLabel}>Just Arrived</span>
                <h3 className={styles.cardTitle}>New Collection</h3>
                <p className={styles.cardDesc}>Explore the latest trends and must-have items</p>
                <span className={styles.cardCta}>
                  Explore <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
