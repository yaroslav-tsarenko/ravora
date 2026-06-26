"use client";

import { useState, useRef } from "react";
import { CheckCircle, Copy, Check } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";
import styles from "./NewsletterBanner.module.css";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Subscribe failed");
      setDiscountCode(data.discountCode ?? null);
      if (data.alreadySubscribed) toast.success("Welcome back!");
    } catch {
      toast.error("Could not subscribe. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyCode = async () => {
    if (!discountCode) return;
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
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
        {discountCode ? (
          <motion.div
            className={styles.successMsg}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", opacity: 0.9 }}>
              <CheckCircle size={16} /> You&apos;re in! Use code:
            </span>
            <button
              type="button"
              onClick={copyCode}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.875rem",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.15)",
                border: "1.5px dashed rgba(255,255,255,0.5)",
                color: "inherit",
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: 700,
                fontSize: "0.9375rem",
                letterSpacing: "0.5px",
              }}
            >
              {discountCode}
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={submitting}
              className={styles.emailInput}
            />
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "…" : "Subscribe"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.section>
  );
}
