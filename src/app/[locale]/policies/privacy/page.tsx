import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Privacy Policy</h1>
      <div style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>1. Information We Collect</h2>
        <p>We collect information you provide directly, such as when you create an account, place an order, or contact us.</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>2. How We Use Your Information</h2>
        <p>We use the information to process orders, communicate with you, and improve our services.</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>3. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information.</p>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginTop: "1.5rem" }}>4. Contact Us</h2>
        <p>If you have questions about this policy, please contact us.</p>
      </div>
    </div>
  );
}
