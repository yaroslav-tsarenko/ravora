"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Package, Users, Truck, Globe2 } from "lucide-react";
import styles from "./StatsBand.module.css";

const stats = [
  { icon: Package, value: "12k+", label: "Products in catalog", tint: "linear-gradient(135deg, #0072CE 0%, #00A3FF 100%)" },
  { icon: Users, value: "48k+", label: "Happy customers", tint: "linear-gradient(135deg, #FF5A00 0%, #FFB800 100%)" },
  { icon: Truck, value: "98%", label: "On-time delivery", tint: "linear-gradient(135deg, #22c55e 0%, #06b6d4 100%)" },
  { icon: Globe2, value: "26", label: "Countries served", tint: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)" },
];

export function StatsBand() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.08 }}
          >
            <div className={styles.icon} style={{ background: stat.tint }}>
              <stat.icon size={22} />
            </div>
            <div className={styles.text}>
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
