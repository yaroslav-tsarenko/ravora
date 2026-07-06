"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import { ArrowRight, Mail, Phone, MapPin, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { RavoraLogo } from "../RavoraLogo";
import { brand, brandAddressLine } from "@/lib/brand";
import visaLogo from "@/assets/visa-logo.svg";
import mastercardLogo from "@/assets/mastercard-logo.svg";
import pciDssLogo from "@/assets/pci-dss-compliant-logo-vector.svg";

const shopLinks = [
  { href: "/catalog", label: "All products" },
  { href: "/catalog?sort=newest", label: "New arrivals" },
  { href: "/catalog?onSale=true", label: "Sale" },
  { href: "/catalog?sort=popular", label: "Best sellers" },
];

const serviceLinks = [
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/returns", label: "Returns" },
  { href: "/policies/warranty", label: "Warranty" },
  { href: "/policies/payment", label: "Payment" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

const companyLinks = [
  { href: "/about", label: "About Ravora" },
  { href: "/policies", label: "Policies" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/terms", label: "Terms" },
  { href: "/policies/cookies", label: "Cookies" },
];

const trustBadges = [
  { icon: Truck, label: "Free UK shipping over £100" },
  { icon: RotateCcw, label: "14-day returns" },
  { icon: ShieldCheck, label: "Genuine warranty" },
];

export function Footer() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="mt-auto bg-[color:var(--color-primary)] text-[color:var(--color-primary-fg)]">
      <div className="mx-auto max-w-[var(--container-content)] px-4 pt-16 sm:px-6 lg:px-8">
        {/* Trust strip */}
        <div className="grid gap-4 border-b border-white/10 pb-10 sm:grid-cols-3">
          {trustBadges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                <Icon size={18} strokeWidth={1.5} />
              </span>
              <span className="text-sm font-medium text-white/90">{label}</span>
            </div>
          ))}
        </div>

        {/* Main columns */}
        <div className="grid gap-10 py-14 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 text-white/95" aria-label="Ravora">
              <span className="text-white">
                <RavoraLogo size={38} />
              </span>
              <span className="font-serif text-2xl font-medium leading-none tracking-tight">
                Ravora
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              A curated selection of modern electronics — carefully sourced, honestly presented,
              and shipped from the United Kingdom.
            </p>

            <div className="mt-6 flex flex-col gap-2 text-sm text-white/70">
              <a
                href={`mailto:${brand.contact.email}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail size={14} /> {brand.contact.email}
              </a>
              <a
                href={brand.contact.phoneHref}
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <Phone size={14} /> {brand.contact.phone}
              </a>
              <span className="inline-flex items-start gap-2 text-white/60">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span className="leading-relaxed">{brandAddressLine}</span>
              </span>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {process.env.NEXT_PUBLIC_LINKEDIN_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_LINKEDIN_URL}
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  <FaLinkedinIn size={14} />
                </a>
              )}
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  <FaInstagram size={14} />
                </a>
              )}
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
              Shop
            </h3>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
              Customer service
            </h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-1">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/80 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
              Ravora Dispatch
            </h3>
            <p className="mt-4 text-sm text-white/70">
              Occasional letters on new arrivals, thoughtful drops, and quiet sales. No noise.
            </p>
            <form
              className="mt-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email) return;
                try {
                  await fetch("/api/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                  });
                } catch { /* silent */ }
                setSubscribed(true);
                setEmail("");
              }}
            >
              <div className="flex overflow-hidden rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@ravora.co.uk"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="inline-flex items-center gap-1 bg-[color:var(--color-accent)] px-4 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[color:var(--color-accent-hover)]"
                >
                  Subscribe <ArrowRight size={14} />
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 text-xs text-white/70">
                  Thanks — we&apos;ll be in touch.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-6 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1 text-xs text-white/60">
            <p>{t("copyright", { year: currentYear, storeName: brand.displayName })}</p>
            <p>
              {brand.company.legalName} · Company No. {brand.company.number} ·{" "}
              {brand.company.address.city}, {brand.company.address.country}
            </p>
          </div>

          <div className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {[
              { src: visaLogo, alt: "Visa" },
              { src: mastercardLogo, alt: "Mastercard" },
              { src: pciDssLogo, alt: "PCI DSS Compliant" },
            ].map(({ src, alt }) => (
              <span
                key={alt}
                className="inline-flex h-8 items-center justify-center rounded-md bg-white/95 px-2"
              >
                <Image src={src} alt={alt} height={20} width={40} className="h-4 w-auto" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
