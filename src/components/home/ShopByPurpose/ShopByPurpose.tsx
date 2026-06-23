"use client";

import { useRef } from "react";
import { Link } from "@/i18n/routing";
import { motion, useInView } from "framer-motion";
import { Building2, Home, Factory, Lightbulb, ShieldCheck, Wrench, ArrowRight } from "lucide-react";
import styles from "./ShopByPurpose.module.css";

const purposes = [
  {
    icon: Home,
    title: "Residential",
    desc: "Switches, sockets, lighting and household wiring kits.",
    href: "/catalog?purpose=residential",
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)",
  },
  {
    icon: Building2,
    title: "Commercial",
    desc: "Distribution boards, smart panels and energy meters.",
    href: "/catalog?purpose=commercial",
    gradient: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
  },
  {
    icon: Factory,
    title: "Industrial",
    desc: "High-current cables, motor protection and PLC accessories.",
    href: "/catalog?purpose=industrial",
    gradient: "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
  },
  {
    icon: Lightbulb,
    title: "Lighting",
    desc: "LED fixtures, drivers, dimmers and outdoor luminaires.",
    href: "/catalog?purpose=lighting",
    gradient: "linear-gradient(135deg, #FACC15 0%, #F97316 100%)",
  },
  {
    icon: ShieldCheck,
    title: "Protection",
    desc: "RCDs, MCBs, fuses, surge protection devices.",
    href: "/catalog?purpose=protection",
    gradient: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
  },
  {
    icon: Wrench,
    title: "Tools & Accessories",
    desc: "Conduit, mounting, terminals, professional hand tools.",
    href: "/catalog?purpose=tools",
    gradient: "linear-gradient(135deg, #64748B 0%, #0F172A 100%)",
  },
];

export function ShopByPurpose() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.header}>
        <div>
          <span className={styles.eyebrow}>Curated paths</span>
          <h2 className={styles.title}>Shop by purpose</h2>
        </div>
        <p className={styles.subtitle}>
          Six tailored entry points into the catalog — every product is filtered, spec-matched, and ready to install.
        </p>
      </div>

      <div className={styles.grid}>
        {purposes.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link href={p.href} className={styles.card}>
              <div className={styles.iconWrap} style={{ background: p.gradient }}>
                <p.icon size={26} />
              </div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <span className={styles.cardCta}>
                Browse <ArrowRight size={14} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
