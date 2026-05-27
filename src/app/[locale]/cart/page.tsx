"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ShoppingCart, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { CartItem } from "@/components/cart/CartItem/CartItem";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { formatPrice } from "@/lib/utils/format-price";

export default function CartPage() {
  const t = useTranslations("cart");
  const nav = useTranslations("nav");
  const { cart } = useCart();

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title") }]} />

      <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
        {t("title")} {cart.items.length > 0 && <span style={{ color: "var(--color-text-tertiary)", fontWeight: 500 }}>({cart.itemCount})</span>}
      </h1>

      {cart.items.length === 0 ? (
        <EmptyState
          title={t("empty")}
          subtitle={t("emptySubtitle")}
          actionLabel={t("continueShopping")}
          actionHref="/catalog"
          icon={<ShoppingCart size={48} />}
        />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2.5rem" }}>
            <div>
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div
              style={{
                padding: "1.75rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                background: "var(--color-bg)",
                height: "fit-content",
                position: "sticky",
                top: "calc(var(--header-height) + var(--announcement-height) + 1rem)",
              }}
            >
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.25rem" }}>
                Order Summary
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>{t("subtotal")}</span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(cart.subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>{t("shipping")}</span>
                  <span style={{ fontWeight: 500, color: cart.shippingCost === 0 ? "var(--color-success)" : undefined }}>
                    {cart.shippingCost > 0 ? formatPrice(cart.shippingCost) : "Free"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>{t("tax")}</span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(cart.taxAmount)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: "0.875rem",
                    marginTop: "0.375rem",
                  }}
                >
                  <span>{t("total")}</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: "var(--radius-xl)",
                  background: "var(--color-accent)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  textDecoration: "none",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
              >
                {t("checkout")} <ArrowRight size={16} />
              </Link>

              <Link
                href="/catalog"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-accent)",
                }}
              >
                {t("continueShopping")}
              </Link>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.375rem",
                marginTop: "1.25rem",
                paddingTop: "1rem",
                borderTop: "1px solid var(--color-border)",
                fontSize: "0.75rem",
                color: "var(--color-text-tertiary)",
              }}>
                <ShieldCheck size={14} />
                Secure checkout with SSL encryption
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
