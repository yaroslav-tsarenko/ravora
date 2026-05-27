import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Heart, Truck, Shield, Award } from "lucide-react";

const values = [
  { icon: <Heart size={28} />, title: "Customer First", desc: "Everything we do starts with our customers. Your satisfaction drives every decision we make." },
  { icon: <Truck size={28} />, title: "Fast & Reliable", desc: "We partner with trusted carriers to deliver your orders quickly and safely, every time." },
  { icon: <Shield size={28} />, title: "Quality Guaranteed", desc: "Every product in our store is carefully vetted for quality and backed by our satisfaction guarantee." },
  { icon: <Award size={28} />, title: "Best Value", desc: "We work directly with brands to offer you competitive prices without compromising on quality." },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: "1rem" }}>
            About <span className="gradient-text">Store</span>
          </h1>
          <p style={{ fontSize: "1.0625rem", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: "540px", margin: "0 auto" }}>
            We&apos;re on a mission to make quality products accessible to everyone. Founded with the belief that great shopping experiences shouldn&apos;t be complicated.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "3rem" }}>
          {values.map((v) => (
            <div key={v.title} style={{
              padding: "1.75rem",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
            }}>
              <div style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-accent-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-accent)",
                marginBottom: "1rem",
              }}>
                {v.icon}
              </div>
              <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, marginBottom: "0.5rem" }}>{v.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        <div style={{
          padding: "2.5rem",
          borderRadius: "var(--radius-2xl)",
          background: "var(--color-accent)",
          color: "white",
          textAlign: "center",
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>Our Promise</h2>
          <p style={{ fontSize: "0.9375rem", opacity: 0.9, lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
            We stand behind every product we sell. If you&apos;re not completely satisfied, we&apos;ll make it right — that&apos;s our guarantee to you.
          </p>
        </div>
      </div>
    </div>
  );
}
