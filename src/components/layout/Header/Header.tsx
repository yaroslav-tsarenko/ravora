"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ShoppingCart, Search, Menu, X, User, Shield,
  ChevronRight, Sparkles, Tag, Flame, Package, Heart, ChevronDown,
} from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./Header.module.css";

const SHOP_MENU_ITEMS = [
  { href: "/catalog", icon: Package, label: "All Products", desc: "Browse our full catalog" },
  { href: "/catalog?sort=newest", icon: Sparkles, label: "New Arrivals", desc: "Just dropped this week" },
  { href: "/catalog?onSale=true", icon: Tag, label: "On Sale", desc: "Best deals right now" },
  { href: "/catalog?sort=popular", icon: Flame, label: "Best Sellers", desc: "Customer favorites" },
];

export function Header() {
  const t = useTranslations("nav");
  const { itemCount } = useCart();
  const { user, role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  const openMega = () => {
    clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  };

  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  };

  return (
    <>
      <div className={styles.announcement}>
        <Sparkles size={14} />
        Free shipping on orders over €50 — <Link href="/catalog?onSale=true">Shop deals</Link>
      </div>

      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
        <div className={styles.container}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoGradient}>Store</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>
              {t("home")}
            </Link>

            <div
              className={styles.navItem}
              ref={megaRef}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button className={styles.navLink} onClick={() => setMegaOpen(!megaOpen)}>
                {t("catalog")}
                <ChevronDown size={14} style={{ transition: "transform 0.2s", transform: megaOpen ? "rotate(180deg)" : undefined }} />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    className={styles.megaMenu}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.megaMenuGrid}>
                      {SHOP_MENU_ITEMS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={styles.megaMenuItem}
                          onClick={() => setMegaOpen(false)}
                        >
                          <div className={styles.megaMenuIcon}>
                            <item.icon size={18} />
                          </div>
                          <div>
                            <div className={styles.megaMenuLabel}>{item.label}</div>
                            <div className={styles.megaMenuDesc}>{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className={styles.megaMenuFooter}>
                      <Link
                        href="/catalog"
                        className={styles.megaMenuFooterLink}
                        onClick={() => setMegaOpen(false)}
                      >
                        View all products <ChevronRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/contact" className={styles.navLink}>
              {t("contact")}
            </Link>
          </nav>

          <div className={styles.actions}>
            <Link href="/search" className={styles.iconButton} aria-label={t("search")}>
              <Search size={20} />
            </Link>

            <ThemeToggle />
            <LanguageSwitcher />

            {user && (
              <Link href="/account/wishlist" className={styles.iconButton} aria-label="Wishlist">
                <Heart size={20} />
              </Link>
            )}

            <Link href="/cart" className={`${styles.iconButton} ${styles.cartButton}`} aria-label={t("cart")}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className={styles.cartBadge}>{itemCount > 99 ? "99+" : itemCount}</span>
              )}
            </Link>

            {user && role === "ADMIN" && (
              <a href="/admin" className={styles.iconButton} aria-label="Admin">
                <Shield size={20} />
              </a>
            )}

            {user ? (
              <Link href="/account" className={styles.iconButton} aria-label={t("account")}>
                <User size={20} />
              </Link>
            ) : (
              <Link href="/auth/login" className={styles.iconButton} aria-label={t("login")}>
                <User size={20} />
              </Link>
            )}

            <button
              className={`${styles.iconButton} ${styles.mobileMenuButton}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

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

                  <Link href="/contact" className={styles.drawerNavLink} onClick={() => setMobileOpen(false)}>
                    {t("contact")} <ChevronRight size={18} />
                  </Link>
                  {user && role === "ADMIN" && (
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
