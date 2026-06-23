"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  ShoppingCart, Search, Menu, X, User, Shield,
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
import { AvontLogo } from "../AvontLogo";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { CatalogMenu } from "../CatalogMenu/CatalogMenu";
import styles from "./Header.module.css";

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

// Ordered most-specific → most-generic so e.g. "home cinema" matches Tv
// before "home" falls through to LayoutGrid.
const ICON_RULES: { kw: string; icon: React.ElementType }[] = [
  // Consumer electronics
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
  // Electrical / installation
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

// Many BigBuy category names are verbose ("Mobile communication and accessories").
// Map these to compact strip-friendly labels.
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

  const sortedCategories = [...categories]
    .sort((a, b) => subtreeCount(b) - subtreeCount(a));

  // When the catalog has a single dominant top-level (e.g., Electronics),
  // promote its subcategories so the strip & mega menu feel rich.
  const useSubcategoryDisplay =
    sortedCategories.length <= 2 && sortedCategories[0]?.children?.length;
  const featuredCategory = sortedCategories[0];
  const displayCategories: Category[] = useSubcategoryDisplay
    ? [...(featuredCategory!.children || [])].sort(
        (a, b) => subtreeCount(b) - subtreeCount(a)
      )
    : sortedCategories;

  const topStripCategories = displayCategories.slice(0, 14);
  const featuredSubcategories = featuredCategory
    ? collectSubcategories(featuredCategory, 18)
    : [];

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        {/* Level 1: Top thin strip */}
        <div className={styles.topStrip}>
          <div className={styles.topStripContainer}>
            <nav className={styles.topNav}>
              <Link href="/" className={`${styles.topNavLink} ${styles.topNavLinkActive}`}>
                Shopping
              </Link>
              <span className={styles.topNavDivider} />
              <Link href="/about" className={styles.topNavLink}>
                About
              </Link>
              <span className={styles.topNavDivider} />
              <Link href="/contact" className={styles.topNavLink}>
                {t("contact")}
              </Link>
            </nav>
            <div className={styles.topActions}>
              <ThemeToggle />
              <CurrencySwitcher />
            </div>
          </div>
        </div>

        {/* Level 2: Main header bar */}
        <div className={styles.mainBar}>
          <div className={styles.mainBarContainer}>
            <button
              className={`${styles.catalogBtn} ${megaOpen ? styles.catalogBtnOpen : ""}`}
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              aria-controls="catalog-dropdown"
              ref={megaRef}
            >
              <Menu size={18} />
              <span className={styles.catalogBtnText}>{t("catalog")}</span>
            </button>

            <Link href="/" className={styles.logo} aria-label="NetimStore — netim.com">
              <AvontLogo size={30} />
              <span className={styles.logoText}>
                <span className={styles.logoTextPrimary}>Netim</span>
                <span className={styles.logoTextAccent}>Store</span>
              </span>
            </Link>

            <form className={styles.searchBar} onSubmit={handleSearch}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.searchBtn} aria-label="Search">
                <Search size={18} />
              </button>
            </form>

            <div className={styles.headerActions}>
              {user && (
                <Link href="/account/wishlist" className={styles.headerAction} aria-label="Wishlist">
                  <Heart size={20} />
                  <span className={styles.headerActionLabel}>Wishlist</span>
                </Link>
              )}

              <Link href="/search" className={styles.headerAction} aria-label="Alerts">
                <Bell size={20} />
                <span className={styles.headerActionLabel}>Alerts</span>
              </Link>

              <span className={styles.headerActionDivider} />

              {user ? (
                <Link href="/account" className={styles.headerAction} aria-label={t("account")}>
                  <User size={20} />
                  <span className={styles.headerActionLabel}>{t("account")}</span>
                </Link>
              ) : (
                <Link href="/auth/login" className={styles.headerAction} aria-label={t("login")}>
                  <User size={20} />
                  <span className={styles.headerActionLabel}>{t("login")}</span>
                </Link>
              )}

              {user && (role === "ADMIN" || role === "SUPER_ADMIN") && (
                <a href="/admin" className={styles.headerAction} aria-label="Admin">
                  <Shield size={20} />
                  <span className={styles.headerActionLabel}>Admin</span>
                </a>
              )}

              <Link href="/cart" className={styles.headerAction} aria-label={t("cart")}>
                <ShoppingCart size={20} />
                <span className={styles.headerActionLabel}>{t("cart")}</span>
                {itemCount > 0 && (
                  <motion.span
                    key={cartBounce}
                    className={styles.cartBadge}
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
            <div className={styles.mobileActions}>
              <Link href="/search" className={styles.mobileBtn} aria-label={t("search")}>
                <Search size={20} />
              </Link>
              <Link href="/cart" className={styles.mobileBtn} aria-label={t("cart")}>
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <motion.span
                    key={cartBounce}
                    className={styles.cartBadgeMobile}
                    initial={cartBounce > 0 ? { scale: 0.5 } : false}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 400 }}
                  >
                    {itemCount > 99 ? "99+" : itemCount}
                  </motion.span>
                )}
              </Link>
              <button
                className={styles.mobileBtn}
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>

          {/* Mobile search row */}
          <div className={styles.mobileSearchRow}>
            <form className={styles.mobileSearchForm} onSubmit={handleSearch}>
              <input
                type="text"
                className={styles.mobileSearchInput}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.mobileSearchBtn} aria-label="Search">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Level 3: Top-level category strip */}
        <div className={styles.categoryStrip}>
          <div className={styles.categoryStripContainer}>
            {topStripCategories.map((cat) => {
              const Icon = getIconForCategory(cat.name);
              const label = shortenCategoryLabel(cat.name);
              return (
                <Link
                  key={cat.id}
                  href={`/catalog/${cat.slug}`}
                  className={styles.categoryItem}
                  title={cat.name}
                >
                  <Icon size={20} className={styles.categoryIcon} />
                  <span className={styles.categoryName}>{label}</span>
                </Link>
              );
            })}
          </div>
          <span className={styles.categoryFadeRight} aria-hidden="true" />
        </div>

        {/* Level 4: Featured subcategory strip — quick links to popular subcategories */}
        {featuredSubcategories.length > 0 && (
          <div className={styles.subCategoryStrip}>
            <div className={styles.subCategoryStripContainer}>
              <span className={styles.subCategoryHeading}>
                Trending:
              </span>
              {featuredSubcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/catalog/${sub.slug}`}
                  className={styles.subCategoryChip}
                  title={sub.name}
                >
                  {shortenCategoryLabel(sub.name, 28)}
                </Link>
              ))}
              <Link href="/catalog" className={styles.subCategoryAll}>
                All categories <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Catalog dropdown — split-pane department menu */}
      <CatalogMenu
        open={megaOpen}
        onClose={() => setMegaOpen(false)}
        categories={categories}
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className={styles.mobileOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className={styles.mobileDrawer}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className={styles.drawerHeader}>
                <span className={styles.drawerTitle}>Menu</span>
                <button className={styles.drawerClose} onClick={() => setMobileOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.drawerBody}>
                <nav className={styles.drawerNav}>
                  <Link href="/" className={styles.drawerNavLink} onClick={() => setMobileOpen(false)}>
                    {t("home")} <ChevronRight size={18} />
                  </Link>
                  <Link href="/catalog" className={styles.drawerNavLink} onClick={() => setMobileOpen(false)}>
                    {t("catalog")} <ChevronRight size={18} />
                  </Link>
                  <Link href="/catalog?sort=newest" className={styles.drawerNavLink} onClick={() => setMobileOpen(false)}>
                    New Arrivals <ChevronRight size={18} />
                  </Link>
                  <Link href="/catalog?onSale=true" className={styles.drawerNavLink} onClick={() => setMobileOpen(false)}>
                    Deals <ChevronRight size={18} />
                  </Link>

                  <div className={styles.drawerDivider} />

                  {displayCategories.slice(0, 8).map((cat) => {
                    const Icon = getIconForCategory(cat.name);
                    return (
                      <Link
                        key={cat.id}
                        href={`/catalog/${cat.slug}`}
                        className={styles.drawerNavLink}
                        onClick={() => setMobileOpen(false)}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <Icon size={16} /> {cat.name}
                        </span>
                        <ChevronRight size={18} />
                      </Link>
                    );
                  })}

                  <div className={styles.drawerDivider} />

                  <Link href="/contact" className={styles.drawerNavLink} onClick={() => setMobileOpen(false)}>
                    {t("contact")} <ChevronRight size={18} />
                  </Link>
                  {user && (role === "ADMIN" || role === "SUPER_ADMIN") && (
                    <a href="/admin" className={styles.drawerNavLink} onClick={() => setMobileOpen(false)}>
                      Admin Panel <ChevronRight size={18} />
                    </a>
                  )}
                </nav>
              </div>

              <div className={styles.drawerFooter}>
                {user ? (
                  <Link href="/account" onClick={() => setMobileOpen(false)}>
                    <div className={`${styles.drawerBtn} ${styles.drawerBtnPrimary}`}>
                      My Account
                    </div>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      <div className={`${styles.drawerBtn} ${styles.drawerBtnPrimary}`}>
                        Sign In
                      </div>
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      <div className={`${styles.drawerBtn} ${styles.drawerBtnSecondary}`}>
                        Create Account
                      </div>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
