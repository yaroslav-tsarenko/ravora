"use client";

import { useRef } from "react";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { motion, useInView } from "framer-motion";
import styles from "./TrustStrip.module.css";

const items = [
  { icon: Truck, label: "Free Shipping", desc: "On orders over €100", color: "#E8F5E9", iconColor: "#2E7D32" },
  { icon: ShieldCheck, label: "Secure Payment", desc: "100% protected checkout", color: "#E3F2FD", iconColor: "#1565C0" },
  { icon: RotateCcw, label: "Easy Returns", desc: "30-day return policy", color: "#FFF3E0", iconColor: "#E65100" },
  { icon: Headphones, label: "24/7 Support", desc: "We're always here to help", color: "#F3E5F5", iconColor: "#6A1B9A" },
];

export function TrustStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <section ref={ref} className={styles.section}>
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          className={styles.item}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <motion.div
            className={styles.iconWrap}
            style={{ background: item.color }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <item.icon size={20} style={{ color: item.iconColor }} />
          </motion.div>
          <div>
            <p className={styles.label}>{item.label}</p>
            <p className={styles.desc}>{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
