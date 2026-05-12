"use client";

import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import styles from "./Breadcrumbs.module.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {index > 0 && (
              <ChevronRight size={14} className={styles.separator} />
            )}
            {item.href ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
