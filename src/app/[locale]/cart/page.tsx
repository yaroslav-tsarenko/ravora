"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight, ShieldCheck, Trash2, Package, Truck, ImageOff } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { QuantitySelector } from "@/components/shared/QuantitySelector/QuantitySelector";
import { PriceDisplay } from "@/components/shared/PriceDisplay/PriceDisplay";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { formatPrice } from "@/lib/utils/format-price";

export default function CartPage() {
  const t = useTranslations("cart");
  const nav = useTranslations("nav");
  const { cart, updateQuantity, removeItem } = useCart();
  const { currency, convert } = useCurrency();

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: t("title") }]} />

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}
      >
        {t("title")}{" "}
        {cart.items.length > 0 && (
          <span style={{ color: "var(--color-text-tertiary)", fontWeight: 500 }}>
            ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
          </span>
        )}
      </motion.h1>

      {cart.items.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <EmptyState
            title={t("empty")}
            subtitle={t("emptySubtitle")}
            actionLabel={t("continueShopping")}
            actionHref="/catalog"
            icon={<ShoppingCart size={48} />}
          />
        </motion.div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2.5rem", alignItems: "start" }}>
            {/* Cart Items */}
            <div
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                background: "var(--color-bg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.5rem",
                  borderBottom: "1px solid var(--color-border)",
                  background: "var(--color-bg-secondary)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Package size={16} style={{ color: "var(--color-text-secondary)" }} />
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>
                    {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"} in your cart
                  </span>
                </div>
                {cart.subtotal >= 50 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", fontWeight: 600, color: "#2E7D32" }}>
                    <Truck size={14} />
                    Free shipping
                  </div>
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {cart.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, padding: 0, margin: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.25 }}
                    style={{
                      display: "flex",
                      gap: "1.25rem",
                      padding: "1.25rem 1.5rem",
                      borderBottom: index < cart.items.length - 1 ? "1px solid var(--color-border)" : "none",
                      alignItems: "center",
                    }}
                  >
                    {/* Product Image */}
                    <div
                      style={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        background: "#fff",
                        border: "1px solid var(--color-border)",
                        flexShrink: 0,
                      }}
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          sizes="100px"
                          style={{ objectFit: "contain", padding: "8px" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-tertiary)" }}>
                          <ImageOff size={24} />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.375rem", minWidth: 0 }}>
                      <Link
                        href={`/product/${item.slug}`}
                        style={{
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "var(--color-text)",
                          textDecoration: "none",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.name}
                      </Link>
                      {item.variantName && (
                        <span style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
                          {item.variantName}
                        </span>
                      )}
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
                        SKU: {item.sku}
                      </span>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.5rem" }}>
                        <QuantitySelector
                          quantity={item.quantity}
                          maxQuantity={item.maxQuantity}
                          onChange={(qty) => updateQuantity(item.productId, qty, item.variantId)}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <PriceDisplay price={item.price * item.quantity} size="sm" />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.productId, item.variantId)}
                            style={{
                              width: "2rem",
                              height: "2rem",
                              borderRadius: "var(--radius-lg)",
                              border: "none",
                              background: "transparent",
                              color: "var(--color-text-tertiary)",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "color 0.15s, background 0.15s",
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-danger)"; e.currentTarget.style.background = "var(--color-bg-tertiary)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-tertiary)"; e.currentTarget.style.background = "transparent"; }}
                            aria-label="Remove"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>{t("subtotal")}</span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(convert(cart.subtotal), currency)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>{t("shipping")}</span>
                  <span style={{ fontWeight: 600, color: cart.shippingCost === 0 ? "#2E7D32" : undefined }}>
                    {cart.shippingCost > 0 ? formatPrice(convert(cart.shippingCost), currency) : "Free"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>{t("tax")} (21%)</span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(convert(cart.taxAmount), currency)}</span>
                </div>

                {cart.subtotal < 50 && (
                  <div
                    style={{
                      padding: "0.625rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-bg-secondary)",
                      fontSize: "0.75rem",
                      color: "var(--color-text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    <Truck size={14} />
                    Add {formatPrice(convert(50 - cart.subtotal), currency)} more for free shipping
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 800,
                    fontSize: "1.25rem",
                    borderTop: "2px solid var(--color-border)",
                    paddingTop: "1rem",
                    marginTop: "0.25rem",
                  }}
                >
                  <span>{t("total")}</span>
                  <span>{formatPrice(convert(cart.total), currency)}</span>
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/checkout"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "var(--radius-xl)",
                    background: "var(--color-accent)",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem",
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(229, 57, 53, 0.3)",
                  }}
                >
                  {t("checkout")} <ArrowRight size={18} />
                </Link>
              </motion.div>

              <Link
                href="/catalog"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "0.875rem",
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
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
