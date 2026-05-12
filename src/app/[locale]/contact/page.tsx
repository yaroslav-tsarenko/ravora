"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/validators/contact";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const inputStyle = { width: "100%", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)", fontSize: "0.875rem", transition: "border-color 0.2s ease, box-shadow 0.2s ease", outline: "none" } as const;
const labelStyle = { display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" } as const;

export default function ContactPage() {
  const t = useTranslations("contact");
  const nav = useTranslations("nav");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      toast.success(t("success"));
    } catch {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "32rem", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title") }]} />

      <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>{t("title")}</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>{t("subtitle")}</p>

      {submitted ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <CheckCircle size={48} style={{ color: "var(--color-success)", margin: "0 auto 1rem" }} />
          <p style={{ fontWeight: 600 }}>{t("success")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>{t("name")}</label>
            <input style={inputStyle} {...register("name")} />
            {errors.name && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.name.message}</span>}
          </div>
          <div>
            <label style={labelStyle}>{t("email")}</label>
            <input type="email" style={inputStyle} {...register("email")} />
            {errors.email && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.email.message}</span>}
          </div>
          <div>
            <label style={labelStyle}>{t("subject")}</label>
            <input style={inputStyle} {...register("subject")} />
            {errors.subject && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.subject.message}</span>}
          </div>
          <div>
            <label style={labelStyle}>{t("message")}</label>
            <textarea rows={4} style={{ ...inputStyle, resize: "vertical" }} {...register("message")} />
            {errors.message && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.message.message}</span>}
          </div>
          <Button type="submit" color="primary" isLoading={loading}>{t("send")}</Button>
        </form>
      )}
    </div>
  );
}
