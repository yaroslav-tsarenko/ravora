"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import styles from "./Testimonials.module.css";

const reviews = [
  {
    name: "Markus W.",
    role: "Electrician · Berlin",
    quote:
      "Ordered cables and conduits late Friday — delivered Monday morning. Everything bundled cleanly with the spec sheet. This is the only supplier I trust for time-sensitive jobs.",
    rating: 5,
    initials: "MW",
    accent: "#0072CE",
  },
  {
    name: "Aurélie R.",
    role: "Site manager · Lyon",
    quote:
      "I run procurement for a 14-person crew. The catalog filters by amp rating and cross-section saved me hours every week. Pricing is transparent, no surprise duties on EU delivery.",
    rating: 5,
    initials: "AR",
    accent: "#FF5A00",
  },
  {
    name: "Tom B.",
    role: "Industrial installer · Rotterdam",
    quote:
      "Needed a niche Schneider distribution block on short notice. Support found a compatible OEM equivalent within an hour and shipped it same day. Above and beyond.",
    rating: 5,
    initials: "TB",
    accent: "#22C55E",
  },
];

export function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.header}>
        <span className={styles.eyebrow}>Customer voices</span>
        <h2 className={styles.title}>Trusted by professionals across Europe</h2>
        <p className={styles.subtitle}>
          Real feedback from electricians, contractors, and procurement teams who buy from MisaElectro every week.
        </p>
      </div>

      <div className={styles.grid}>
        {reviews.map((r, i) => (
          <motion.article
            key={r.name}
            className={styles.card}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.1 }}
          >
            <Quote className={styles.quoteIcon} size={28} />
            <div className={styles.stars}>
              {Array.from({ length: r.rating }).map((_, idx) => (
                <Star key={idx} size={14} fill="#FFB800" stroke="#FFB800" />
              ))}
            </div>
            <p className={styles.quote}>“{r.quote}”</p>
            <div className={styles.author}>
              <span className={styles.avatar} style={{ background: r.accent }}>
                {r.initials}
              </span>
              <div className={styles.authorMeta}>
                <span className={styles.name}>{r.name}</span>
                <span className={styles.role}>{r.role}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
