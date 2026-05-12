"use client";

import { useAuth } from "@/providers/AuthProvider";
import { AccountSidebar } from "@/components/account/AccountSidebar/AccountSidebar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const nav = useTranslations("nav");
  const t = useTranslations("account");

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/en/auth/login";
    }
  }, [loading, user]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title") }]} />
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem", alignItems: "start" }}>
        <AccountSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
