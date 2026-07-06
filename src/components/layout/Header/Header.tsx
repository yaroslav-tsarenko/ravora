"use client";

import { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  ShoppingBag, Search, Menu, X, User, Shield,
  ChevronRight, Heart, Bell,
  Cable, LayoutGrid, Zap, Lightbulb, CircuitBoard, Plug,
  Box, Wrench, Shield as ShieldIcon, SquareStack,
  Headphones, Watch, Smartphone, Tablet, Tv, Camera,
  Speaker, Music, Gamepad2, Cpu, HardDrive, Mouse,
  Keyboard, Battery, Phone, Radio, Printer, Mic, Car,
  Navigation,
} from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { ThemeToggle } from "./ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import { RavoraLogo } from "../RavoraLogo";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { CatalogMenu } from "../CatalogMenu/CatalogMenu";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
  children?: Category[];
}

function subtreeCount(cat: Category): number {
  const own = cat._count?.products || 0;
  return own + (cat.children || []).reduce((s, c) => s + subtreeCount(c), 0);
}

function collectSubcategories(cat: Category, limit = 30): Category[] {
  const result: Category[] = [];
  const walk = (c: Category) => {
    for (const child of c.children || []) {
      if (result.length >= limit) return;
      result.push(child);
      walk(child);
    }
  };
  walk(cat);
  return result
    .sort((a, b) => subtreeCount(b) - subtreeCount(a))
    .slice(0, limit);
}

const ICON_RULES: { kw: string; icon: React.ElementType }[] = [
  { kw: "headphone", icon: Headphones },
  { kw: "earphone", icon: Headphones },
  { kw: "soundbar", icon: Speaker },
  { kw: "speaker", icon: Speaker },
  { kw: "microphone", icon: Mic },
  { kw: "audio", icon: Music },
  { kw: "hi-fi", icon: Music },
  { kw: "hifi", icon: Music },
  { kw: "stereo", icon: Music },
  { kw: "record player", icon: Music },
  { kw: "tv", icon: Tv },
  { kw: "television", icon: Tv },
  { kw: "video", icon: Tv },
  { kw: "home cinema", icon: Tv },
  { kw: "projector", icon: Tv },
  { kw: "smartwatch", icon: Watch },
  { kw: "watch", icon: Watch },
  { kw: "mobile phone", icon: Smartphone },
  { kw: "mobile communication", icon: Smartphone },
  { kw: "smartphone", icon: Smartphone },
  { kw: "phone", icon: Phone },
  { kw: "landline", icon: Phone },
  { kw: "tablet", icon: Tablet },
  { kw: "camera", icon: Camera },
  { kw: "photography", icon: Camera },
  { kw: "console", icon: Gamepad2 },
  { kw: "gaming", icon: Gamepad2 },
  { kw: "game", icon: Gamepad2 },
  { kw: "computer", icon: Cpu },
  { kw: "laptop", icon: Cpu },
  { kw: "storage", icon: HardDrive },
  { kw: "memory", icon: HardDrive },
  { kw: "mouse", icon: Mouse },
  { kw: "keyboard", icon: Keyboard },
  { kw: "printer", icon: Printer },
  { kw: "scanner", icon: Printer },
  { kw: "battery", icon: Battery },
  { kw: "charger", icon: Battery },
  { kw: "radio", icon: Radio },
  { kw: "gps", icon: Navigation },
  { kw: "navigation", icon: Navigation },
  { kw: "vehicle", icon: Car },
  { kw: "car ", icon: Car },
  { kw: "automotive", icon: Car },
  { kw: "wiring", icon: Cable },
  { kw: "cable", icon: Cable },
  { kw: "automation", icon: CircuitBoard },
  { kw: "control", icon: CircuitBoard },
  { kw: "distribution", icon: LayoutGrid },
  { kw: "energy", icon: Zap },
  { kw: "power", icon: Zap },
  { kw: "protection", icon: ShieldIcon },
  { kw: "protective", icon: ShieldIcon },
  { kw: "fuse", icon: Zap },
  { kw: "lighting", icon: Lightbulb },
  { kw: "light", icon: Lightbulb },
  { kw: "lamp", icon: Lightbulb },
  { kw: "terminal", icon: SquareStack },
  { kw: "mounting", icon: Box },
  { kw: "conduit", icon: Wrench },
  { kw: "connector", icon: Plug },
  { kw: "plug", icon: Plug },
  { kw: "tool", icon: Wrench },
  { kw: "box", icon: Box },
];

function getIconForCategory(name: string) {
  const lower = name.toLowerCase();
  for (const { kw, icon } of ICON_RULES) {
    if (lower.includes(kw)) return icon;
  }
  return LayoutGrid;
}

const LABEL_OVERRIDES: { pattern: RegExp; label: string }[] = [
  { pattern: /^mobile communication.*/i, label: "Mobile & accessories" },
  { pattern: /^mobile phones?$/i, label: "Mobile phones" },
  { pattern: /^tv,? video and home cinema.*/i, label: "TV & video" },
  { pattern: /^portable audio.*/i, label: "Portable audio" },
  { pattern: /^audio and hi-fi.*/i, label: "Audio & Hi-Fi" },
  { pattern: /^plug & play games consoles?.*/i, label: "Games consoles" },
  { pattern: /^batteries and chargers?.*/i, label: "Batteries & chargers" },
  { pattern: /^landline telephones?.*/i, label: "Landlines" },
  { pattern: /^accessories for food preparation.*/i, label: "Kitchen accessories" },
  { pattern: /^smartwatches?.*/i, label: "Smartwatches" },
  { pattern: /^gps and accessories?.*/i, label: "GPS" },
  { pattern: /^disposable batteries?.*/i, label: "Disposable batteries" },
  { pattern: /^photography and accessories?.*/i, label: "Photography" },
];

function shortenCategoryLabel(name: string, max = 22): string {
  for (const { pattern, label } of LABEL_OVERRIDES) {
    if (pattern.test(name)) return label;
  }
  if (name.length <= max) return name;
  return name.slice(0, max - 1).trimEnd() + "…";
}

const topBarBase =
  "bg-[color:var(--color-primary)] text-[color:var(--color-primary-fg)] dark:bg-[color:var(--color-header)]";
const utilityLink =
  "inline-flex items-center text-[12px] font-medium tracking-wide text-white/80 transition-colors hover:text-white";

export function Header() {
  const t = useTranslations("nav");
  const router = useRouter();
  const { itemCount, cartBounce } = useCart();
  const { user, role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const megaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/en/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const sortedCategories = [...categories].sort((a, b) => subtreeCount(b) - subtreeCount(a));
  const useSubcategoryDisplay =
    sortedCategories.length <= 2 && sortedCategories[0]?.children?.length;
  const featuredCategory = sortedCategories[0];
  const displayCategories: Category[] = useSubcategoryDisplay
    ? [...(featuredCategory!.children || [])].sort((a, b) => subtreeCount(b) - subtreeCount(a))
    : sortedCategories;

  const topStripCategories = displayCategories.slice(0, 12);
  const featuredSubcategories = featuredCategory ? collectSubcategories(featuredCategory, 16) : [];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b border-[color:var(--color-line)] bg-[color:var(--color-bg)]/95 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-[0_1px_0_0_var(--color-line)]" : ""
        }`}
      >
        {/* Level 1 — Top utility bar (deep pine) */}
        <div className={topBarBase}>
          <div className="mx-auto flex h-9 max-w-[var(--container-content)] items-center justify-between px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-4 sm:gap-5">
              <Link href="/" className={`${utilityLink} !text-white`}>
                Shopping
              </Link>
              <span aria-hidden className="h-3 w-px bg-white/20" />
              <Link href="/about" className={utilityLink}>
                About
              </Link>
              <span aria-hidden className="h-3 w-px bg-white/20" />
              <Link href="/contact" className={utilityLink}>
                {t("contact")}
              </Link>
            </nav>
            <div className="flex items-center gap-2 text-white">
              <ThemeToggle />
              <CurrencySwitcher />
            </div>
          </div>
        </div>

        {/* Level 2 — Main bar */}
        <div className="border-b border-[color:var(--color-line)] bg-[color:var(--color-bg)]">
          <div className="mx-auto flex h-16 max-w-[var(--container-content)] items-center gap-4 px-4 sm:h-[72px] sm:px-6 lg:h-[80px] lg:gap-6 lg:px-8">
            <button
              className={`hidden items-center gap-2 rounded-lg border border-[color:var(--color-line)] px-3 py-2 text-sm font-medium text-[color:var(--color-text)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] lg:inline-flex ${
                megaOpen ? "!border-[color:var(--color-primary)] !text-[color:var(--color-primary)] bg-[color:var(--color-primary-tint)]" : ""
              }`}
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              aria-controls="catalog-dropdown"
              ref={megaRef}
            >
              <Menu size={16} />
              <span>{t("catalog")}</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-2.5 text-[color:var(--color-primary)]"
              aria-label="Ravora"
            >
              <span className="text-[color:var(--color-primary)]">
                <RavoraLogo size={34} />
              </span>
              <span className="hidden font-serif text-2xl font-medium leading-none tracking-tight text-[color:var(--color-text)] sm:inline">
                Ravora
              </span>
            </Link>

            <form
              className="hidden flex-1 items-center rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] pl-4 pr-1 shadow-[0_1px_0_0_rgba(28,26,23,0.03)] transition-shadow focus-within:border-[color:var(--color-primary)] focus-within:shadow-[0_0_0_3px_var(--color-primary-tint)] md:flex"
              onSubmit={handleSearch}
            >
              <Search size={16} className="text-[color:var(--color-text-tertiary)]" />
              <input
                type="text"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none"
                placeholder="Search Ravora"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Search"
                className="inline-flex h-9 items-center justify-center rounded-full bg-[color:var(--color-primary)] px-4 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[color:var(--color-primary-hover)]"
              >
                Search
              </button>
            </form>

            {/* Desktop actions */}
            <div className="hidden items-center gap-1 lg:flex">
              {user && (
                <Link
                  href="/account/wishlist"
                  className="group inline-flex h-11 flex-col items-center justify-center rounded-lg px-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                  aria-label="Wishlist"
                >
                  <Heart size={20} />
                  <span className="mt-0.5 text-[10px] font-medium tracking-wide">Wishlist</span>
                </Link>
              )}

              <Link
                href="/search"
                className="group inline-flex h-11 flex-col items-center justify-center rounded-lg px-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                aria-label="Alerts"
              >
                <Bell size={20} />
                <span className="mt-0.5 text-[10px] font-medium tracking-wide">Alerts</span>
              </Link>

              {user ? (
                <Link
                  href="/account"
                  className="group inline-flex h-11 flex-col items-center justify-center rounded-lg px-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                  aria-label={t("account")}
                >
                  <User size={20} />
                  <span className="mt-0.5 text-[10px] font-medium tracking-wide">{t("account")}</span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="group inline-flex h-11 flex-col items-center justify-center rounded-lg px-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                  aria-label={t("login")}
                >
                  <User size={20} />
                  <span className="mt-0.5 text-[10px] font-medium tracking-wide">{t("login")}</span>
                </Link>
              )}

              {user && (role === "ADMIN" || role === "SUPER_ADMIN") && (
                <NextLink
                  href="/admin"
                  className="group inline-flex h-11 flex-col items-center justify-center rounded-lg px-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                  aria-label="Admin"
                >
                  <Shield size={20} />
                  <span className="mt-0.5 text-[10px] font-medium tracking-wide">Admin</span>
                </NextLink>
              )}

              <Link
                href="/cart"
                className="group relative inline-flex h-11 flex-col items-center justify-center rounded-lg px-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-secondary)] hover:text-[color:var(--color-primary)]"
                aria-label={t("cart")}
              >
                <ShoppingBag size={20} />
                <span className="mt-0.5 text-[10px] font-medium tracking-wide">{t("cart")}</span>
                {itemCount > 0 && (
                  <motion.span
                    key={cartBounce}
                    className="absolute right-0 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--color-accent)] px-1 text-[10px] font-bold text-white"
                    initial={cartBounce > 0 ? { scale: 0.5 } : false}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 400 }}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Link>
            </div>

            {/* Mobile actions */}
            <div className="ml-auto flex items-center gap-1 lg:hidden">
              <Link
                href="/search"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-secondary)]"
                aria-label={t("search")}
              >
                <Search size={20} />
              </Link>
              <Link
                href="/cart"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-secondary)]"
                aria-label={t("cart")}
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    key={cartBounce}
                    className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[color:var(--color-accent)] px-1 text-[10px] font-bold text-white"
                    initial={cartBounce > 0 ? { scale: 0.5 } : false}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 400 }}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>

          {/* Mobile search row */}
          <div className="border-t border-[color:var(--color-line)] px-4 py-2 md:hidden">
            <form
              className="flex items-center rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] pl-3 pr-1"
              onSubmit={handleSearch}
            >
              <Search size={16} className="text-[color:var(--color-text-tertiary)]" />
              <input
                type="text"
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-tertiary)] focus:outline-none"
                placeholder="Search Ravora"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Search"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-white"
              >
                <Search size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Level 3 — Category strip */}
        {topStripCategories.length > 0 && (
          <div className="relative border-b border-[color:var(--color-line)] bg-[color:var(--color-bg)]">
            <div className="scrollbar-none mx-auto flex max-w-[var(--container-content)] items-center gap-6 overflow-x-auto px-4 sm:px-6 lg:px-8">
              {topStripCategories.map((cat) => {
                const Icon = getIconForCategory(cat.name);
                const label = shortenCategoryLabel(cat.name);
                return (
                  <Link
                    key={cat.id}
                    href={`/catalog/${cat.slug}`}
                    className="group flex shrink-0 flex-col items-center gap-1 py-2.5 text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-primary)]"
                    title={cat.name}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    <span className="whitespace-nowrap text-[11px] font-medium tracking-wide">
                      {label}
                    </span>
                    <span className="mt-0.5 h-[2px] w-6 rounded-full bg-transparent transition-colors group-hover:bg-[color:var(--color-primary)]" />
                  </Link>
                );
              })}
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[color:var(--color-bg)] to-transparent"
            />
          </div>
        )}

        {/* Level 4 — Trending strip */}
        {featuredSubcategories.length > 0 && (
          <div className="hidden border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-secondary)] md:block">
            <div className="scrollbar-none mx-auto flex max-w-[var(--container-content)] items-center gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
              <span className="mr-1 shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-tertiary)]">
                Trending
              </span>
              {featuredSubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/catalog/${sub.slug}`}
                  className="inline-flex shrink-0 items-center rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-elevated)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                  title={sub.name}
                >
                  {shortenCategoryLabel(sub.name, 28)}
                </Link>
              ))}
              <Link
                href="/catalog"
                className="ml-auto inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[color:var(--color-primary)]"
              >
                All categories <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </header>

      <CatalogMenu open={megaOpen} onClose={() => setMegaOpen(false)} categories={categories} />

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-[color:var(--color-text)]/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-[color:var(--color-bg)] shadow-xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between border-b border-[color:var(--color-line)] px-5 py-4">
                <span className="font-serif text-lg font-medium text-[color:var(--color-text)]">
                  Menu
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-secondary)]"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                <nav className="flex flex-col">
                  {[
                    { href: "/", label: t("home") },
                    { href: "/catalog", label: t("catalog") },
                    { href: "/catalog?sort=newest", label: "New Arrivals" },
                    { href: "/catalog?onSale=true", label: "Deals" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                      <ChevronRight size={16} className="text-[color:var(--color-text-tertiary)]" />
                    </Link>
                  ))}

                  <div className="my-2 h-px bg-[color:var(--color-line)]" />

                  {displayCategories.slice(0, 8).map((cat) => {
                    const Icon = getIconForCategory(cat.name);
                    return (
                      <Link
                        key={cat.id}
                        href={`/catalog/${cat.slug}`}
                        className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className="flex items-center gap-3 text-[color:var(--color-text-secondary)]">
                          <Icon size={16} />
                          <span className="text-[color:var(--color-text)]">{cat.name}</span>
                        </span>
                        <ChevronRight size={16} className="text-[color:var(--color-text-tertiary)]" />
                      </Link>
                    );
                  })}

                  <div className="my-2 h-px bg-[color:var(--color-line)]" />

                  <Link
                    href="/contact"
                    className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {t("contact")}
                    <ChevronRight size={16} className="text-[color:var(--color-text-tertiary)]" />
                  </Link>

                  {user && (role === "ADMIN" || role === "SUPER_ADMIN") && (
                    <NextLink
                      href="/admin"
                      className="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-secondary)]"
                      onClick={() => setMobileOpen(false)}
                    >
                      Admin Panel
                      <ChevronRight size={16} className="text-[color:var(--color-text-tertiary)]" />
                    </NextLink>
                  )}
                </nav>
              </div>

              <div className="flex flex-col gap-2 border-t border-[color:var(--color-line)] px-5 py-4">
                {user ? (
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-sm font-semibold text-white hover:bg-[color:var(--color-accent-hover)]"
                  >
                    My Account
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--color-accent)] text-sm font-semibold text-white hover:bg-[color:var(--color-accent-hover)]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--color-primary)] text-sm font-semibold text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary-tint)]"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
