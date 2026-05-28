"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { ChevronRight, ChevronDown, Menu, X } from "lucide-react";
import styles from "./CategorySidebar.module.css";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
  children?: Category[];
}

function CategoryItem({ cat, depth = 0, onNavigate }: { cat: Category; depth?: number; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;
  const count = cat._count?.products || 0;

  return (
    <>
      <div className={styles.item} style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}>
        <Link
          href={`/catalog/${cat.slug}`}
          className={styles.itemLink}
          onClick={onNavigate}
        >
          <span className={styles.name}>{cat.name}</span>
          {count > 0 && <span className={styles.count}>{count}</span>}
        </Link>
        {hasChildren && (
          <button
            className={styles.expandBtn}
            onClick={(e) => { e.preventDefault(); setExpanded(!expanded); }}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>
      {hasChildren && expanded && cat.children!.map((child) => (
        <CategoryItem key={child.id} cat={child} depth={depth + 1} onNavigate={onNavigate} />
      ))}
    </>
  );
}

export function CategorySidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(console.error);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen(true)}
        aria-label="Open categories"
      >
        <Menu size={20} />
        <span>Categories</span>
      </button>

      {mobileOpen && (
        <div className={styles.overlay} onClick={closeMobile} />
      )}

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.open : ""}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <Menu size={16} />
            Catalog
          </h3>
          <button
            className={styles.closeBtn}
            onClick={closeMobile}
            aria-label="Close categories"
          >
            <X size={20} />
          </button>
        </div>
        <nav className={styles.list}>
          {categories.length === 0 ? (
            <div className={styles.skeleton}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className={styles.skeletonItem}>
                  <div className={styles.skeletonBar} style={{ width: `${55 + (i * 17) % 35}%`, flexShrink: 0 }} />
                  <div className={styles.skeletonBar} style={{ width: "24px", marginLeft: "auto" }} />
                </div>
              ))}
            </div>
          ) : (
            categories.map((cat) => (
              <CategoryItem key={cat.id} cat={cat} onNavigate={closeMobile} />
            ))
          )}
        </nav>
      </aside>
    </>
  );
}
