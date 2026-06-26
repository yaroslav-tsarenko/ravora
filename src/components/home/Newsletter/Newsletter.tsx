"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import styles from "./Newsletter.module.css";

export function Newsletter() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      if (data.discountCode) {
        setDiscountCode(data.discountCode);
        toast.success(data.alreadySubscribed ? "Welcome back!" : "Thanks! Use your code at checkout.");
      } else {
        toast.success("Subscribed!");
      }
      setEmail("");
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
      className={`${styles.section} section-padding`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.bgOrb + " " + styles.bgOrb1} />
      <div className={styles.bgOrb + " " + styles.bgOrb2} />
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>{t("newsletter")}</h2>
          <p className={styles.subtitle}>{t("newsletterSubtitle")}</p>
        </div>
        {discountCode ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 1.125rem",
            borderRadius: "14px",
            background: "rgba(255,255,255,0.95)",
            color: "#065F46",
            fontWeight: 700,
          }}>
            <Check size={18} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
              <span style={{ fontSize: "0.6875rem", fontWeight: 500, opacity: 0.7 }}>Your 10% code</span>
              <span style={{ fontSize: "1rem", letterSpacing: "0.5px" }}>{discountCode}</span>
            </div>
            <button
              type="button"
              onClick={copyCode}
              aria-label="Copy code"
              style={{
                border: "none",
                background: "#10B981",
                color: "#fff",
                padding: "0.5rem 0.625rem",
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletterPlaceholder")}
              className={styles.input}
              required
              disabled={submitting}
            />
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              <Send size={16} />
              {submitting ? "…" : t("newsletterCta")}
            </button>
          </form>
        )}
      </div>
    </motion.section>
  );
}
