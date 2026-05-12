"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import styles from "./Newsletter.module.css";

export function Newsletter() {
  const t = useTranslations("home");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thanks for subscribing!");
      setEmail("");
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
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletterPlaceholder")}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.submitBtn}>
            <Send size={16} />
            {t("newsletterCta")}
          </button>
        </form>
      </div>
    </motion.section>
  );
}
