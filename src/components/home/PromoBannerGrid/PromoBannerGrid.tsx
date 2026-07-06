"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

interface BannerData {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  ctaLabel?: string | null;
  bgColor: string;
  textColor: string;
  badgeText?: string | null;
}

interface Props {
  smallBanners: BannerData[];
  wideBanners: BannerData[];
}

const defaultWide: BannerData[] = [
  {
    id: "w1",
    badgeText: "Pro Account",
    title: "Register & Get 10% Off Your First Order",
    subtitle: "Free shipping over £100, trade pricing, and priority support",
    bgColor: "",
    textColor: "",
    linkUrl: "/auth/register",
    ctaLabel: "Join Free",
  },
];

export function PromoBannerGrid({ smallBanners, wideBanners }: Props) {
  const small = smallBanners;
  const wide = wideBanners.length > 0 ? wideBanners : defaultWide;

  return (
    <div className="flex flex-col gap-4">
      {small.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {small.map((b) => (
            <Link
              key={b.id}
              href={b.linkUrl || "#"}
              className="group flex flex-col justify-between gap-3 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)] p-6 text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)]"
            >
              {b.badgeText && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-accent)]">
                  {b.badgeText}
                </span>
              )}
              <h3 className="font-serif text-xl font-medium leading-snug tracking-tight">
                {b.title}
              </h3>
              {b.subtitle && (
                <span className="text-sm text-[color:var(--color-text-secondary)]">
                  {b.subtitle}
                </span>
              )}
              <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-primary)] transition-transform group-hover:translate-x-1">
                Shop now <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      )}
      {wide.map((b) => (
        <Link
          key={b.id}
          href={b.linkUrl || "#"}
          className="group relative flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-primary)] px-6 py-6 text-[color:var(--color-primary-fg)] transition-colors hover:bg-[color:var(--color-primary-hover)] sm:px-10 sm:py-8"
        >
          <div className="flex flex-1 flex-col gap-1">
            {b.badgeText && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--color-accent)]">
                {b.badgeText}
              </span>
            )}
            <h3 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
              {b.title}
            </h3>
            {b.subtitle && (
              <p className="max-w-2xl text-sm text-white/70">{b.subtitle}</p>
            )}
          </div>
          {b.ctaLabel && (
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-[color:var(--color-accent-hover)]">
              {b.ctaLabel} <ArrowRight size={16} />
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
