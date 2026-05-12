"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";

export default function AccountPage() {
  const t = useTranslations("account");
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>{t("title")}</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
        {t("welcome", { name: user?.name || user?.email || "" })}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        <div style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Email</p>
          <p style={{ fontWeight: 600 }}>{user?.email}</p>
        </div>
        <div style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Name</p>
          <p style={{ fontWeight: 600 }}>{user?.name || "Not set"}</p>
        </div>
        <div style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>Role</p>
          <p style={{ fontWeight: 600 }}>{user?.role}</p>
        </div>
      </div>
    </div>
  );
}
