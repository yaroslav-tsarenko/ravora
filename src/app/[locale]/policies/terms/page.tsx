import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Terms of Service</h1>
      <div style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>1. Acceptance of Terms</h2>
        <p>By using our store, you agree to these terms of service.</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>2. Orders and Payment</h2>
        <p>All orders are subject to acceptance and availability. Prices are subject to change.</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>3. Shipping</h2>
        <p>We ship worldwide. Delivery times vary by location and shipping method.</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>4. Limitation of Liability</h2>
        <p>Our liability is limited to the purchase price of the products.</p>
      </div>
    </div>
  );
}
