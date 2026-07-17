import { Link } from "@/i18n/routing";
import { Home, Search, LifeBuoy } from "lucide-react";

const links = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/catalog", label: "Browse catalog", Icon: Search },
  { href: "/contact", label: "Contact us", Icon: LifeBuoy },
];

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[var(--container-content)] flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="eyebrow">Error 404</span>
      <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-[color:var(--color-text)] sm:text-5xl">
        This page has moved on
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[color:var(--color-text-secondary)]">
        The page you were looking for doesn&apos;t exist or has been relocated. Let&apos;s get
        you back to something worth browsing.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        {links.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] px-6 py-3 text-sm font-semibold text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
