"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Chip } from "@heroui/react";
import { useAuth } from "@/providers/AuthProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { formatPrice } from "@/lib/utils/format-price";
import { format } from "date-fns";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string }[];
}

const statusColors: Record<string, "default" | "accent" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "accent",
  PROCESSING: "accent",
  SHIPPED: "default",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "danger",
};

export default function OrdersPage() {
  const t = useTranslations("account");
  const nav = useTranslations("nav");
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data.data) ? data.data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title"), href: "/account" }, { label: t("orders") }]} />

      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>{t("orders")}</h1>

      {orders.length === 0 ? (
        <EmptyState title={t("noOrders")} subtitle={t("noOrdersSubtitle")} actionLabel={nav("catalog")} actionHref="/catalog" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.5rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                transition: "background 0.2s",
              }}
            >
              <div>
                <span style={{ fontWeight: 600 }}>{t("orderNumber", { number: order.orderNumber.slice(-8) })}</span>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)", marginTop: "0.25rem" }}>
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Chip size="sm" color={statusColors[order.status] || "default"}>{order.status}</Chip>
                <span style={{ fontWeight: 600 }}>{formatPrice(Number(order.total))}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
