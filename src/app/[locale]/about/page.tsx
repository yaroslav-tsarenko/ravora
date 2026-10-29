import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Heart, Truck, Shield, Award } from "lucide-react";

const values = [
  { icon: <Heart size={28} strokeWidth={1.5} />, title: "Customer First", desc: "From first-time shoppers to loyal regulars, your satisfaction drives every decision we make." },
  { icon: <Truck size={28} strokeWidth={1.5} />, title: "Made to Order", desc: "Every piece is printed to order by Printful and shipped in 5–8 business days, so nothing goes to waste." },
  { icon: <Shield size={28} strokeWidth={1.5} />, title: "Premium Quality", desc: "We choose soft, durable fabrics and long-lasting prints that hold up wash after wash." },
  { icon: <Award size={28} strokeWidth={1.5} />, title: "Fair Pricing", desc: "Thoughtful designs and honest prices, with free UK shipping on every order over £100." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--max-width)] px-4 pb-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center sm:mb-12">
          <span className="eyebrow">Our story</span>
          <h1 className="mb-4 mt-3 font-serif text-4xl font-medium tracking-tight text-[color:var(--color-text)] sm:text-5xl">
            About <span className="text-[color:var(--color-accent)]">Ravora</span>
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-[color:var(--color-text-secondary)] sm:text-lg">
            We&apos;re on a mission to make premium, made-to-order apparel that people love to wear. Finding pieces that fit well, feel great, and last shouldn&apos;t be complicated.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 sm:gap-5">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] p-5 sm:p-7">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-primary-tint)] text-[color:var(--color-primary)]">
                {v.icon}
              </div>
              <h3 className="mb-2 text-[17px] font-semibold text-[color:var(--color-text)]">{v.title}</h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-[color:var(--color-primary)] p-8 text-center text-[color:var(--color-primary-fg)] sm:p-10">
          <h2 className="mb-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">Our Promise</h2>
          <p className="mx-auto max-w-lg text-[15px] leading-relaxed opacity-90">
            We stand behind every piece we make. If you&apos;re not completely satisfied, we&apos;ll make it right — that&apos;s our guarantee to you.
          </p>
        </div>
      </div>
    </div>
  );
}
