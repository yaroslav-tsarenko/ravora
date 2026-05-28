"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";
import styles from "./PromoBanners.module.css";

const banners = [
  {
    image: banner1,
    tag: "Professional Grade",
    title: "Switchgear & Distribution Boards",
    desc: "Certified panels, circuit breakers, and modular enclosures for residential and commercial installations.",
    href: "/catalog",
    cta: "Shop Switchgear",
    accent: "#1565C0",
  },
  {
    image: banner2,
    tag: "Complete Range",
    title: "Industrial Control & Automation",
    desc: "From compact enclosures to full-size distribution cabinets — everything for your next project.",
    href: "/catalog",
    cta: "Browse Equipment",
    accent: "#E65100",
  },
  {
    image: banner3,
    tag: "Top Quality",
    title: "Cables, Wiring & Connectors",
    desc: "Premium copper cables, flexible wiring, terminal blocks, and accessories at wholesale prices.",
    href: "/catalog",
    cta: "View Cables",
    accent: "#2E7D32",
  },
];

export function PromoBanners() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.grid}>
        {banners.map((b, i) => (
          <motion.div
            key={i}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <div className={styles.imageWrap}>
              <Image
                src={b.image}
                alt={b.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={styles.image}
                priority={i === 0}
              />
              <div className={styles.overlay} />
            </div>
            <div className={styles.content}>
              <span className={styles.tag} style={{ background: b.accent }}>
                {b.tag}
              </span>
              <h3 className={styles.title}>{b.title}</h3>
              <p className={styles.desc}>{b.desc}</p>
              <Link href={b.href} className={styles.cta} style={{ color: b.accent }}>
                {b.cta} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
