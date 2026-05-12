"use client";

import { useTranslations } from "next-intl";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { MapPin } from "lucide-react";

export default function AddressesPage() {
  const t = useTranslations("account");
  const nav = useTranslations("nav");

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title"), href: "/account" }, { label: t("addresses") }]} />

      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>{t("addresses")}</h1>
      <EmptyState
        title="No addresses yet"
        subtitle="Add a shipping address for faster checkout"
        icon={<MapPin size={48} />}
      />
    </div>
  );
}
