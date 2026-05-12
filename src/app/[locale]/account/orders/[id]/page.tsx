"use client";

import { useEffect, useState, use } from "react";
import { useTranslations } from "next-intl";
import { Chip } from "@heroui/react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { formatPrice } from "@/lib/utils/format-price";
import { format } from "date-fns";
import type { OrderDetail } from "@/types/order";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslations("account");
  const nav = useTranslations("nav");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div>Order not found</div>;

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[
        { label: nav("home"), href: "/" },
        { label: t("title"), href: "/account" },
        { label: t("orders"), href: "/account/orders" },
        { label: t("orderNumber", { number: order.orderNumber.slice(-8) }) },
      ]} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          {t("orderNumber", { number: order.orderNumber.slice(-8) })}
        </h1>
        <Chip size="lg">{order.status}</Chip>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Shipping Address</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
            {order.shippingAddress.address1}<br />
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
        <div>
          <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Order Info</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
            Date: {format(new Date(order.createdAt), "MMM d, yyyy")}<br />
            Payment: {order.paymentStatus}
          </p>
        </div>
      </div>

      <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-secondary)" }}>
              <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.875rem" }}>Product</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.875rem" }}>Qty</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.875rem" }}>Price</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.875rem" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>{item.productName}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.875rem" }}>{item.quantity}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.875rem" }}>{formatPrice(item.price)}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.875rem", fontWeight: 600 }}>{formatPrice(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.25rem", fontSize: "0.875rem" }}>
          <div>Subtotal: {formatPrice(order.subtotal)}</div>
          <div>Shipping: {formatPrice(order.shippingCost)}</div>
          <div>Tax: {formatPrice(order.taxAmount)}</div>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>Total: {formatPrice(order.total)}</div>
        </div>
      </div>
    </div>
  );
}
