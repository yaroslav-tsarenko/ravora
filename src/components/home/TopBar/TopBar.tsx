"use client";

import { Link } from "@/i18n/routing";
import { MapPin, Phone, Globe, Info, HelpCircle, Truck, RotateCcw, CreditCard, Package } from "lucide-react";
import styles from "./TopBar.module.css";

const ICON_MAP: Record<string, React.ElementType> = {
  MapPin, Phone, Globe, Info, HelpCircle, Truck, RotateCcw, CreditCard, Package,
};

interface UtilityLink {
  id: string;
  label: string;
  linkUrl: string;
  icon?: string | null;
  position: string;
}

interface Props {
  links: UtilityLink[];
}

const defaultLinks: UtilityLink[] = [
  { id: "1", label: "About", linkUrl: "/about", position: "left" },
  { id: "2", label: "Payment", linkUrl: "/policies/terms", position: "left" },
  { id: "3", label: "Delivery", linkUrl: "/faq", position: "left" },
  { id: "4", label: "Returns", linkUrl: "/policies/returns", position: "left" },
  { id: "5", label: "FAQ", linkUrl: "/faq", position: "left" },
  { id: "6", label: "Pickup Points", linkUrl: "#", icon: "MapPin", position: "right" },
  { id: "7", label: "Contacts", linkUrl: "/contact", icon: "Phone", position: "right" },
];

export function TopBar({ links }: Props) {
  const items = links.length > 0 ? links : defaultLinks;
  const leftLinks = items.filter((l) => l.position === "left");
  const rightLinks = items.filter((l) => l.position === "right");

  return (
    <div className={styles.topBar}>
      <div className={styles.container}>
        <nav className={styles.left}>
          {leftLinks.map((link) => {
            const Icon = link.icon ? ICON_MAP[link.icon] : null;
            return (
              <Link key={link.id} href={link.linkUrl} className={styles.link}>
                {Icon && <Icon size={13} />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className={styles.right}>
          {rightLinks.map((link) => {
            const Icon = link.icon ? ICON_MAP[link.icon] : null;
            return (
              <Link key={link.id} href={link.linkUrl} className={styles.link}>
                {Icon && <Icon size={13} />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
