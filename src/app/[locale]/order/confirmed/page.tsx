"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmedPage() {
  const t = useTranslations("notifications");
  const nav = useTranslations("nav");

  return (
    <div style={{ maxWidth: "32rem", margin: "4rem auto", padding: "0 1rem", textAlign: "center" }}>
      <CheckCircle size={64} style={{ color: "var(--color-success)", margin: "0 auto 1rem" }} />
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        {t("orderPlaced")}
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
        Thank you for your order. We&apos;ll send you a confirmation email shortly.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Button as={Link} href="/account/orders" variant="bordered">
          View Orders
        </Button>
        <Button as={Link} href="/catalog" color="primary">
          {nav("catalog")}
        </Button>
      </div>
    </div>
  );
}
