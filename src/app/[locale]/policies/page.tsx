import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Link } from "@/i18n/routing";

export const metadata = { title: "Policies — AvontShop" };

const policies = [
  { label: "Terms and Conditions", href: "/policies/terms" },
  { label: "Shipping Policy", href: "/policies/shipping" },
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Cookie Policy", href: "/policies/cookies" },
  { label: "Returns, Refunds and Cancellation Policy", href: "/policies/returns" },
  { label: "Payment Policy", href: "/policies/payment" },
  { label: "Warranty Policy", href: "/policies/warranty" },
];

export default function PoliciesIndexPage() {
  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Policies" }]} />
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--color-text)" }}>
        Policies
      </h1>
      <p style={{ lineHeight: 1.8, color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
        Please review our policies below. These policies govern your use of the AvontShop website and
        any purchases made through it.
      </p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {policies.map((policy) => (
          <li key={policy.href} style={{ marginBottom: "0.75rem" }}>
            <Link
              href={policy.href}
              style={{
                color: "var(--color-text)",
                textDecoration: "underline",
                fontSize: "1.05rem",
              }}
            >
              {policy.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
