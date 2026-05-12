import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";

export const metadata = { title: "Returns & Refunds" };

export default function ReturnsPage() {
  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Returns & Refunds" }]} />
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Returns & Refunds</h1>
      <div style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>1. Return Policy</h2>
        <p>Items may be returned within 14 days of delivery in their original condition.</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>2. Refund Process</h2>
        <p>Refunds are processed within 5-10 business days after we receive the returned item.</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>3. Non-Returnable Items</h2>
        <p>Personalized items, perishable goods, and items on clearance cannot be returned.</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>4. Contact</h2>
        <p>For return requests, please contact our support team.</p>
      </div>
    </div>
  );
}
