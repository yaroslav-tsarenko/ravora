"use client";

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ArrowRight, Package, MessageCircle, UserPlus } from "lucide-react";
import styles from "./HomeCTABanners.module.css";

const cards = [
  {
    icon: Package,
    title: "See our full range",
    subtitle: "Browse the entire catalog of electrical materials and supplies.",
    cta: "Shop catalog",
    href: "/catalog",
    bg: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
    accent: "#4F46E5",
  },
  {
    icon: MessageCircle,
    title: "Have a question?",
    subtitle: "Contact our team and we will help you find what you need.",
    cta: "Get in touch",
    href: "/contact",
    bg: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
    accent: "#059669",
  },
  {
    icon: UserPlus,
    title: "Create an account",
    subtitle: "Shop securely, track orders, and unlock a 10% welcome discount.",
    cta: "Sign up",
    href: "/auth/register",
    bg: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
    accent: "#D97706",
  },
] as const;

export function HomeCTABanners() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link href={card.href} className={styles.card} style={{ background: card.bg }}>
                <div className={styles.iconWrap} style={{ color: card.accent, background: "rgba(255,255,255,0.65)" }}>
                  <Icon size={24} />
                </div>
                <div className={styles.body}>
                  <h3 className={styles.title}>{card.title}</h3>
                  <p className={styles.subtitle}>{card.subtitle}</p>
                </div>
                <span className={styles.cta} style={{ color: card.accent }}>
                  {card.cta}
                  <ArrowRight size={16} />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
