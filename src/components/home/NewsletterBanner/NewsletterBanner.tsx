"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import styles from "./NewsletterBanner.module.css";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className={styles.section}>
      <div className={styles.textSide}>
        <div className={styles.topRow}>
          <div className={styles.discountCircle}>
            <span className={styles.discountNum}>10%</span>
            <span className={styles.discountOff}>OFF</span>
          </div>
          <div>
            <h2 className={styles.title}>Subscribe & Save 10%</h2>
            <p className={styles.subtitle}>Get exclusive deals, new arrivals & special offers straight to your inbox.</p>
          </div>
        </div>
      </div>
      <div className={styles.formSide}>
        {submitted ? (
          <span className={styles.successMsg}>
            <CheckCircle size={18} /> You&apos;re in! Check your inbox.
          </span>
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
      </div>
    </section>
  );
}
