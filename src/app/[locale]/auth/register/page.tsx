"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, User, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import styles from "../auth.module.css";

function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (password.length === 0) return { level: 0, label: "", color: "transparent" };
  if (password.length < 6) return { level: 25, label: "Weak", color: "#ef4444" };
  if (password.length < 10) return { level: 50, label: "Fair", color: "#f59e0b" };
  if (password.length < 14) return { level: 75, label: "Good", color: "#22c55e" };
  return { level: 100, label: "Strong", color: "#16a34a" };
}

export default function RegisterPage() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const strength = getPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      toast.success("Account created!");
      window.location.href = "/en/account";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4 },
    }),
  } as const;

  return (
    <div className={styles.authPage}>
      <motion.div
        className={styles.authCard}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div className={styles.authHeader} custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <div className={styles.logoIcon}>
            <ShoppingBag size={24} />
          </div>
          <h1 className={styles.authTitle}>{t("registerTitle")}</h1>
          <p className={styles.authSubtitle}>{t("registerSubtitle")}</p>
        </motion.div>

        <form onSubmit={handleRegister} className={styles.form}>
          <motion.div className={styles.inputGroup} custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <label className={styles.inputLabel}>{t("name")}</label>
            <div className={styles.inputWrapper}>
              <User size={16} className={styles.inputIcon} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={styles.input}
              />
            </div>
          </motion.div>

          <motion.div className={styles.inputGroup} custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <label className={styles.inputLabel}>{t("email")}</label>
            <div className={styles.inputWrapper}>
              <Mail size={16} className={styles.inputIcon} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={styles.input}
              />
            </div>
          </motion.div>

          <motion.div className={styles.inputGroup} custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <label className={styles.inputLabel}>{t("password")}</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min 6 characters"
                className={`${styles.input} ${styles.inputWithToggle}`}
              />
              <button
                type="button"
                className={styles.inputToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password.length > 0 && (
              <div style={{ marginTop: "0.5rem" }}>
                <div style={{ height: 4, borderRadius: 2, background: "var(--color-border)", overflow: "hidden" }}>
                  <div style={{ width: `${strength.level}%`, height: "100%", background: strength.color, transition: "width 0.3s" }} />
                </div>
                <p style={{ fontSize: "0.75rem", color: strength.color, marginTop: "0.25rem" }}>{strength.label}</p>
              </div>
            )}
          </motion.div>

          <motion.div className={styles.inputGroup} custom={4} variants={fadeUp} initial="hidden" animate="visible">
            <label className={styles.inputLabel}>{t("confirmPassword")}</label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className={`${styles.input} ${styles.inputWithToggle}`}
              />
              <button
                type="button"
                className={styles.inputToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </motion.div>

          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className={styles.submitButton}>
            <Button type="submit" color="primary" fullWidth isLoading={loading}>
              {t("signUp")}
            </Button>
          </motion.div>
        </form>

        <motion.p className={styles.authFooter} custom={6} variants={fadeUp} initial="hidden" animate="visible">
          {t("haveAccount")}{" "}
          <Link href="/auth/login">
            {t("signIn")}
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}
