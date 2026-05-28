"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { useCurrency } from "@/providers/CurrencyProvider";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validators/checkout";
import { formatPrice } from "@/lib/utils/format-price";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { toast } from "sonner";
import {
  Mail, Phone, MapPin, Truck, CreditCard,
  ChevronRight, ShieldCheck, Lock, Check, ImageOff,
} from "lucide-react";

const SHIPPING_METHODS = [
  { key: "standard", label: "Standard Shipping", time: "5-7 business days", price: 5.99, icon: Truck },
  { key: "express", label: "Express Shipping", time: "2-3 business days", price: 12.99, icon: Truck },
  { key: "free", label: "Economy Shipping", time: "7-14 business days", price: 0, icon: Truck },
];

const stepIcons = [Mail, MapPin, CreditCard];
const stepVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const inputBaseStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  paddingLeft: "2.75rem",
  borderRadius: "12px",
  border: "1.5px solid var(--color-border)",
  background: "var(--color-bg)",
  color: "var(--color-text)",
  fontSize: "0.875rem",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const inputPlainStyle: React.CSSProperties = {
  ...inputBaseStyle,
  paddingLeft: "1rem",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8125rem",
  fontWeight: 600,
  marginBottom: "0.375rem",
  color: "var(--color-text-secondary)",
};

const errorStyle: React.CSSProperties = {
  color: "var(--color-danger)",
  fontSize: "0.75rem",
  marginTop: "0.25rem",
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
};

function InputWithIcon({ icon: Icon, error, ...props }: { icon: React.ElementType; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ position: "relative" }}>
      <Icon size={16} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)", pointerEvents: "none" }} />
      <input
        {...props}
        style={{
          ...inputBaseStyle,
          borderColor: error ? "var(--color-danger)" : undefined,
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(229,57,53,0.1)"; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = error ? "var(--color-danger)" : "var(--color-border)"; e.currentTarget.style.boxShadow = "none"; }}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const nav = useTranslations("nav");
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { currency, convert } = useCurrency();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
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
  const shippingPrice = SHIPPING_METHODS.find((m) => m.key === selectedMethod)?.price ?? 5.99;

  const goNext = async () => {
    if (step === 0) {
      const valid = await trigger("contact");
      if (!valid) return;
    } else if (step === 1) {
      const valid = await trigger(["shipping", "shippingMethod"]);
      if (!valid) return;
    }
    setStep((s) => Math.min(s + 1, 2));
  };

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

  if (cart.items.length === 0) return null;

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: nav("home"), href: "/" }, { label: nav("cart"), href: "/cart" }, { label: t("title") }]} />

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "2rem" }}
      >
        {t("title")}
      </motion.h1>

      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
          marginBottom: "2.5rem",
          padding: "0.25rem",
          borderRadius: "16px",
          background: "var(--color-bg-secondary)",
        }}
      >
        {steps.map((s, i) => {
          const Icon = stepIcons[i];
          const isActive = i === step;
          const isDone = i < step;
          return (
            <button
              key={i}
              onClick={() => i < step && setStep(i)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                border: "none",
                cursor: i <= step ? "pointer" : "default",
                background: isActive ? "var(--color-bg)" : "transparent",
                boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                fontWeight: isActive ? 700 : 500,
                fontSize: "0.8125rem",
                color: isActive ? "var(--color-text)" : isDone ? "var(--color-accent)" : "var(--color-text-tertiary)",
                transition: "all 0.2s",
              }}
            >
              {isDone ? (
                <div style={{ width: "1.25rem", height: "1.25rem", borderRadius: "50%", background: "var(--color-accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={12} strokeWidth={3} />
                </div>
              ) : (
                <Icon size={16} />
              )}
              <span style={{ display: "inline" }}>{s}</span>
            </button>
          );
        })}
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2.5rem", alignItems: "start" }}>
        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="contact"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  padding: "2rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  background: "var(--color-bg)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: "2rem", height: "2rem", borderRadius: "10px", background: "var(--color-accent-light)", color: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Mail size={16} />
                  </div>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>{t("contact")}</h2>
                </div>
                <div>
                  <label style={labelStyle}>{t("email")}</label>
                  <InputWithIcon
                    icon={Mail}
                    placeholder="your@email.com"
                    error={errors.contact?.email?.message}
                    {...register("contact.email")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t("phone")}</label>
                  <InputWithIcon
                    icon={Phone}
                    placeholder="+371 20 000 000"
                    error={errors.contact?.phone?.message}
                    {...register("contact.phone")}
                  />
                </div>
                <Button color="primary" size="lg" onPress={goNext} style={{ marginTop: "0.5rem" }}>
                  Continue to Shipping <ChevronRight size={16} />
                </Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="shipping"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  padding: "2rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  background: "var(--color-bg)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: "2rem", height: "2rem", borderRadius: "10px", background: "var(--color-accent-light)", color: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPin size={16} />
                  </div>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>{t("shipping")}</h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>{t("firstName")}</label>
                    <input style={{ ...inputPlainStyle, borderColor: errors.shipping?.firstName ? "var(--color-danger)" : undefined }} placeholder="John" {...register("shipping.firstName")} />
                    {errors.shipping?.firstName && <span style={errorStyle}>{errors.shipping.firstName.message}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>{t("lastName")}</label>
                    <input style={{ ...inputPlainStyle, borderColor: errors.shipping?.lastName ? "var(--color-danger)" : undefined }} placeholder="Doe" {...register("shipping.lastName")} />
                    {errors.shipping?.lastName && <span style={errorStyle}>{errors.shipping.lastName.message}</span>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>{t("address")}</label>
                  <InputWithIcon icon={MapPin} placeholder="123 Main Street" error={errors.shipping?.address1?.message} {...register("shipping.address1")} />
                </div>
                <div>
                  <label style={labelStyle}>{t("apartment")}</label>
                  <input style={inputPlainStyle} placeholder="Apt 4B (optional)" {...register("shipping.address2")} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>{t("city")}</label>
                    <input style={{ ...inputPlainStyle, borderColor: errors.shipping?.city ? "var(--color-danger)" : undefined }} placeholder="Riga" {...register("shipping.city")} />
                    {errors.shipping?.city && <span style={errorStyle}>{errors.shipping.city.message}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>{t("province")}</label>
                    <input style={inputPlainStyle} placeholder="Region (optional)" {...register("shipping.province")} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>{t("postalCode")}</label>
                    <input style={{ ...inputPlainStyle, borderColor: errors.shipping?.postalCode ? "var(--color-danger)" : undefined }} placeholder="LV-1001" {...register("shipping.postalCode")} />
                    {errors.shipping?.postalCode && <span style={errorStyle}>{errors.shipping.postalCode.message}</span>}
                  </div>
                  <div>
                    <label style={labelStyle}>{t("country")}</label>
                    <input style={{ ...inputPlainStyle, borderColor: errors.shipping?.country ? "var(--color-danger)" : undefined }} placeholder="Latvia" {...register("shipping.country")} />
                    {errors.shipping?.country && <span style={errorStyle}>{errors.shipping.country.message}</span>}
                  </div>
                </div>

                {/* Shipping Method Cards */}
                <div>
                  <label style={{ ...labelStyle, marginBottom: "0.75rem" }}>{t("shippingMethod")}</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {SHIPPING_METHODS.map((m) => {
                      const isSelected = selectedMethod === m.key;
                      return (
                        <label
                          key={m.key}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            padding: "1rem 1.25rem",
                            borderRadius: "12px",
                            border: `1.5px solid ${isSelected ? "var(--color-accent)" : "var(--color-border)"}`,
                            background: isSelected ? "var(--color-accent-light)" : "var(--color-bg)",
                            cursor: "pointer",
                            transition: "all 0.15s",
                          }}
                        >
                          <input type="radio" value={m.key} {...register("shippingMethod")} style={{ display: "none" }} />
                          <div
                            style={{
                              width: "1.25rem",
                              height: "1.25rem",
                              borderRadius: "50%",
                              border: `2px solid ${isSelected ? "var(--color-accent)" : "var(--color-border)"}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {isSelected && <div style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--color-accent)" }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>{m.label}</div>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>{m.time}</div>
                          </div>
                          <span style={{ fontSize: "0.875rem", fontWeight: 700, color: m.price === 0 ? "#2E7D32" : "var(--color-text)" }}>
                            {m.price === 0 ? "Free" : formatPrice(convert(m.price), currency)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <Button variant="bordered" size="lg" onPress={() => setStep(0)} style={{ flex: "0 0 auto" }}>
                    Back
                  </Button>
                  <Button color="primary" size="lg" onPress={goNext} style={{ flex: 1 }}>
                    Review Order <ChevronRight size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="review"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  padding: "2rem",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-xl)",
                  background: "var(--color-bg)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: "2rem", height: "2rem", borderRadius: "10px", background: "var(--color-accent-light)", color: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CreditCard size={16} />
                  </div>
                  <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }}>{t("review")}</h2>
                </div>

                {/* Order Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {cart.items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        padding: "0.875rem 0",
                        borderBottom: i < cart.items.length - 1 ? "1px solid var(--color-border)" : "none",
                      }}
                    >
                      <div style={{
                        position: "relative",
                        width: "56px",
                        height: "56px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        background: "#fff",
                        border: "1px solid var(--color-border)",
                        flexShrink: 0,
                      }}>
                        {item.imageUrl ? (
                          <Image src={item.imageUrl} alt={item.name} fill sizes="56px" style={{ objectFit: "contain", padding: "4px" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-tertiary)" }}>
                            <ImageOff size={18} />
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>Qty: {item.quantity}</div>
                      </div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, flexShrink: 0 }}>
                        {formatPrice(convert(item.price * item.quantity), currency)}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <Button variant="bordered" size="lg" onPress={() => setStep(1)} style={{ flex: "0 0 auto" }}>
                    Back
                  </Button>
                  <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      isLoading={submitting}
                      style={{ width: "100%" }}
                      startContent={!submitting ? <Lock size={16} /> : undefined}
                    >
                      {t("placeOrder")}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Order Summary Sidebar */}
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
          <h3 style={{ fontWeight: 700, fontSize: "1.0625rem", marginBottom: "1.25rem" }}>{t("orderSummary")}</h3>

          {/* Mini item list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-border)" }}>
            {cart.items.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "#fff",
                  border: "1px solid var(--color-border)",
                  flexShrink: 0,
                }}>
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill sizes="40px" style={{ objectFit: "contain", padding: "2px" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
                      <ImageOff size={14} />
                    </div>
                  )}
                  <div style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "var(--color-text-secondary)",
                    color: "#fff",
                    fontSize: "0.625rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {item.quantity}
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--color-text-secondary)" }}>
                  {item.name}
                </span>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>
                  {formatPrice(convert(item.price * item.quantity), currency)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", fontSize: "0.875rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>{formatPrice(convert(cart.subtotal), currency)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Shipping</span>
              <span style={{ fontWeight: 500, color: shippingPrice === 0 ? "#2E7D32" : undefined }}>
                {shippingPrice > 0 ? formatPrice(convert(shippingPrice), currency) : "Free"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Tax (21%)</span>
              <span style={{ fontWeight: 500 }}>{formatPrice(convert(cart.taxAmount), currency)}</span>
            </div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 800,
              fontSize: "1.125rem",
              borderTop: "2px solid var(--color-border)",
              paddingTop: "0.875rem",
              marginTop: "0.375rem",
            }}>
              <span>Total</span>
              <span>{formatPrice(convert(cart.subtotal + cart.taxAmount + shippingPrice), currency)}</span>
            </div>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--color-border)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
              <ShieldCheck size={14} />
              Secure checkout with SSL encryption
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
              <Lock size={14} />
              Your data is protected
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
