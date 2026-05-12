"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { LayoutDashboard, Package, User, MapPin, Heart, LogOut } from "lucide-react";
import styles from "./AccountSidebar.module.css";

const navItems = [
  { href: "/account", icon: <LayoutDashboard size={18} />, labelKey: "title" as const },
  { href: "/account/orders", icon: <Package size={18} />, labelKey: "orders" as const },
  { href: "/account/profile", icon: <User size={18} />, labelKey: "profile" as const },
  { href: "/account/addresses", icon: <MapPin size={18} />, labelKey: "addresses" as const },
  { href: "/account/wishlist", icon: <Heart size={18} />, labelKey: "wishlist" as const },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const t = useTranslations("account");
  const { user, signOut } = useAuth();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
        </div>
        <div>
          <p className={styles.userName}>{user?.name || "User"}</p>
          <p className={styles.userEmail}>{user?.email}</p>
        </div>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive =
            pathname.endsWith(item.href) ||
            (item.href !== "/account" && pathname.includes(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
            >
              {item.icon}
              {t(item.labelKey)}
            </Link>
          );
        })}
        <button className={styles.logoutButton} onClick={signOut}>
          <LogOut size={18} />
          {t("logout")}
        </button>
      </nav>
    </aside>
  );
}
