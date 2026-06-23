"use client";

import { useRef } from "react";
import { Link } from "@/i18n/routing";
import { motion, useInView } from "framer-motion";
import { BookOpen, Calculator, FileText, ArrowUpRight } from "lucide-react";
import styles from "./KnowledgeHub.module.css";

const articles = [
  {
    icon: BookOpen,
    eyebrow: "Guide",
    title: "How to size a cable for a 32 A circuit",
    desc: "Cross-sections, voltage drop, and what the latest IEC 60364 says about derating in conduit.",
    href: "/about",
    accent: "#0072CE",
  },
  {
    icon: Calculator,
    eyebrow: "Tool",
    title: "Distribution board planner",
    desc: "Pick a panel layout, count breakers, and we'll auto-suggest spare slots and DIN-rail width.",
    href: "/about",
    accent: "#FF5A00",
  },
  {
    icon: FileText,
    eyebrow: "Reference",
    title: "RCD vs RCBO: a 60-second cheat sheet",
    desc: "Where each one fits in a residential installation — and why we ship more RCBOs every year.",
    href: "/about",
    accent: "#22C55E",
  },
];

export function KnowledgeHub() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Knowledge hub</span>
          <h2 className={styles.title}>Resources to help you spec right</h2>
          <p className={styles.subtitle}>
            Practical guides and tools from our in-house electrical engineers.
          </p>
        </div>
        <Link href="/about" className={styles.allLink}>
          Browse all resources <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className={styles.grid}>
        {articles.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.08 }}
          >
            <Link href={a.href} className={styles.card}>
              <div className={styles.iconWrap} style={{ background: `${a.accent}1A`, color: a.accent }}>
                <a.icon size={20} />
              </div>
              <span className={styles.cardEyebrow} style={{ color: a.accent }}>{a.eyebrow}</span>
              <h3 className={styles.cardTitle}>{a.title}</h3>
              <p className={styles.cardDesc}>{a.desc}</p>
              <span className={styles.cardCta}>
                Read <ArrowUpRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
