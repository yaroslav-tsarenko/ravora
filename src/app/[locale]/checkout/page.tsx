"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validators/checkout";
import { formatPrice } from "@/lib/utils/format-price";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { toast } from "sonner";

const SHIPPING_METHODS = [
  { key: "standard", label: "Standard Shipping (5-7 days)", price: 5.99 },
  { key: "express", label: "Express Shipping (2-3 days)", price: 12.99 },
  { key: "free", label: "Free Shipping (7-14 days)", price: 0 },
];

const inputStyle = { width: "100%", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)", fontSize: "0.875rem" } as const;
const labelStyle = { display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" } as const;

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const nav = useTranslations("nav");
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      contact: { email: user?.email || "", phone: "" },
      shipping: {
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
      },
      shippingMethod: "standard",
    },
  });

  const steps = [t("contact"), t("shipping"), t("review")];
  const selectedMethod = watch("shippingMethod");

  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      toast.error("Please log in to place an order");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            variantName: item.variantName,
          })),
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      const order = await res.json();
      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order/confirmed?orderId=${order.id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push("/cart");
    }
  }, [cart.items.length, router]);

  if (cart.items.length === 0) {
    return null;
  }

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: nav("cart"), href: "/cart" }, { label: t("title") }]} />

      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>{t("title")}</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "0.75rem",
              textAlign: "center",
              borderBottom: `2px solid ${i <= step ? "var(--color-accent)" : "var(--color-border)"}`,
              fontWeight: i === step ? 700 : 400,
              color: i <= step ? "var(--color-text)" : "var(--color-text-tertiary)",
              cursor: i < step ? "pointer" : "default",
            }}
            onClick={() => i < step && setStep(i)}
          >
            {s}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "3rem" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>{t("contact")}</h2>
              <div>
                <label style={labelStyle}>{t("email")}</label>
                <input style={inputStyle} {...register("contact.email")} />
                {errors.contact?.email && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.contact.email.message}</span>}
              </div>
              <div>
                <label style={labelStyle}>{t("phone")}</label>
                <input style={inputStyle} {...register("contact.phone")} />
              </div>
              <Button color="primary" onPress={() => setStep(1)}>Continue</Button>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>{t("shipping")}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>{t("firstName")}</label>
                  <input style={inputStyle} {...register("shipping.firstName")} />
                  {errors.shipping?.firstName && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.shipping.firstName.message}</span>}
                </div>
                <div>
                  <label style={labelStyle}>{t("lastName")}</label>
                  <input style={inputStyle} {...register("shipping.lastName")} />
                  {errors.shipping?.lastName && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.shipping.lastName.message}</span>}
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t("address")}</label>
                <input style={inputStyle} {...register("shipping.address1")} />
                {errors.shipping?.address1 && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.shipping.address1.message}</span>}
              </div>
              <div>
                <label style={labelStyle}>{t("apartment")}</label>
                <input style={inputStyle} {...register("shipping.address2")} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>{t("city")}</label>
                  <input style={inputStyle} {...register("shipping.city")} />
                  {errors.shipping?.city && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.shipping.city.message}</span>}
                </div>
                <div>
                  <label style={labelStyle}>{t("province")}</label>
                  <input style={inputStyle} {...register("shipping.province")} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>{t("postalCode")}</label>
                  <input style={inputStyle} {...register("shipping.postalCode")} />
                  {errors.shipping?.postalCode && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.shipping.postalCode.message}</span>}
                </div>
                <div>
                  <label style={labelStyle}>{t("country")}</label>
                  <input style={inputStyle} {...register("shipping.country")} />
                  {errors.shipping?.country && <span style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>{errors.shipping.country.message}</span>}
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t("shippingMethod")}</label>
                <select style={inputStyle} {...register("shippingMethod")}>
                  {SHIPPING_METHODS.map((m) => (
                    <option key={m.key} value={m.key}>{`${m.label} - ${formatPrice(m.price)}`}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button variant="light" onPress={() => setStep(0)}>Back</Button>
                <Button color="primary" onPress={() => setStep(2)}>Continue</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>{t("review")}</h2>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border)" }}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <Button variant="light" onPress={() => setStep(1)}>Back</Button>
                <Button type="submit" color="primary" isLoading={submitting} style={{ flex: 1 }}>
                  {t("placeOrder")}
                </Button>
              </div>
            </div>
          )}
        </form>

        <div style={{ padding: "1.5rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", height: "fit-content" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>{t("orderSummary")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Shipping</span><span>{cart.shippingCost > 0 ? formatPrice(cart.shippingCost) : "Free"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Tax</span><span>{formatPrice(cart.taxAmount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid var(--color-border)", paddingTop: "0.5rem", marginTop: "0.25rem" }}>
              <span>Total</span><span>{formatPrice(cart.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
