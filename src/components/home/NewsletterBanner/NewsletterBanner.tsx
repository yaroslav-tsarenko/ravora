"use client";

import { useState, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { motion, useInView } from "framer-motion";
import styles from "./NewsletterBanner.module.css";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <motion.section
      ref={ref}
      className={styles.section}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={styles.textSide}
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.topRow}>
          <motion.div
            className={styles.discountCircle}
            animate={isInView ? { rotate: [0, -8, 8, -4, 0] } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className={styles.discountNum}>10%</span>
            <span className={styles.discountOff}>OFF</span>
          </motion.div>
          <div>
            <h2 className={styles.title}>Subscribe & Save 10%</h2>
            <p className={styles.subtitle}>Get exclusive deals, new arrivals & special offers straight to your inbox.</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className={styles.formSide}
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {submitted ? (
          <motion.span
            className={styles.successMsg}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <CheckCircle size={18} /> You&apos;re in! Check your inbox.
          </motion.span>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={styles.emailInput}
            />
            <button type="submit" className={styles.submitBtn}>Subscribe</button>
          </form>
        )}
      </motion.div>
    </motion.section>
  );
}
