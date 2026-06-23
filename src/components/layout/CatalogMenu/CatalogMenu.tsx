"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight, X, Search, ArrowRight,
  Cable, LayoutGrid, Zap, Lightbulb, CircuitBoard, Plug,
  Box, Wrench, Shield, SquareStack, Sparkles, Headphones,
  Battery, Camera, Tv, Smartphone, Tablet, Watch, Speaker,
  Music, Gamepad2, Cpu, HardDrive, Mouse, Keyboard,
} from "lucide-react";
import styles from "./CatalogMenu.module.css";

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
  children?: CatalogCategory[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  categories: CatalogCategory[];
}

const ICON_MAP: { kw: string; icon: React.ElementType }[] = [
  { kw: "headphone", icon: Headphones },
  { kw: "speaker", icon: Speaker },
  { kw: "audio", icon: Music },
  { kw: "hi-fi", icon: Music },
  { kw: "stereo", icon: Music },
  { kw: "tv", icon: Tv },
  { kw: "television", icon: Tv },
  { kw: "phone", icon: Smartphone },
  { kw: "mobile", icon: Smartphone },
  { kw: "tablet", icon: Tablet },
  { kw: "watch", icon: Watch },
  { kw: "camera", icon: Camera },
  { kw: "battery", icon: Battery },
  { kw: "charger", icon: Battery },
  { kw: "gaming", icon: Gamepad2 },
  { kw: "console", icon: Gamepad2 },
  { kw: "game", icon: Gamepad2 },
  { kw: "computer", icon: Cpu },
  { kw: "laptop", icon: Cpu },
  { kw: "storage", icon: HardDrive },
  { kw: "mouse", icon: Mouse },
  { kw: "keyboard", icon: Keyboard },
  { kw: "cable", icon: Cable },
  { kw: "wiring", icon: Cable },
  { kw: "automation", icon: CircuitBoard },
  { kw: "control", icon: CircuitBoard },
  { kw: "distribution", icon: LayoutGrid },
  { kw: "energy", icon: Zap },
  { kw: "power", icon: Zap },
  { kw: "lighting", icon: Lightbulb },
  { kw: "light", icon: Lightbulb },
  { kw: "lamp", icon: Lightbulb },
  { kw: "protection", icon: Shield },
  { kw: "fuse", icon: Zap },
  { kw: "terminal", icon: SquareStack },
  { kw: "mounting", icon: Box },
  { kw: "conduit", icon: Wrench },
  { kw: "tool", icon: Wrench },
  { kw: "connector", icon: Plug },
  { kw: "plug", icon: Plug },
  { kw: "box", icon: Box },
];

function getIcon(name: string): React.ElementType {
  const lower = name.toLowerCase();
  for (const { kw, icon } of ICON_MAP) {
    if (lower.includes(kw)) return icon;
  }
  return LayoutGrid;
}

function subtreeCount(cat: CatalogCategory): number {
  const own = cat._count?.products || 0;
  return own + (cat.children || []).reduce((s, c) => s + subtreeCount(c), 0);
}

// If the catalog is dominated by a single top-level, promote its children
// so the rail feels rich and useful.
function pickDepartments(categories: CatalogCategory[]): CatalogCategory[] {
  const sorted = [...categories].sort((a, b) => subtreeCount(b) - subtreeCount(a));
  if (sorted.length <= 2 && sorted[0]?.children?.length) {
    return [...(sorted[0].children || [])].sort(
      (a, b) => subtreeCount(b) - subtreeCount(a)
    );
  }
  return sorted;
}

export function CatalogMenu({ open, onClose, categories }: Props) {
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const departments = useMemo(() => pickDepartments(categories), [categories]);

  // Derive active department: explicit pin > first available
  const activeId = pinnedId ?? departments[0]?.id ?? null;
  const setActiveId = setPinnedId;

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const active = departments.find((d) => d.id === activeId) || departments[0];
  const activeChildren = useMemo(() => {
    if (!active) return [] as CatalogCategory[];
    return [...(active.children || [])].sort(
      (a, b) => subtreeCount(b) - subtreeCount(a)
    );
  }, [active]);

  const filteredDepartments = useMemo(() => {
    if (!query.trim()) return departments;
    const q = query.trim().toLowerCase();
    return departments.filter((d) => {
      if (d.name.toLowerCase().includes(q)) return true;
      return (d.children || []).some((c) => c.name.toLowerCase().includes(q));
    });
  }, [departments, query]);

  const filteredChildren = useMemo(() => {
    if (!query.trim()) return activeChildren;
    const q = query.trim().toLowerCase();
    return activeChildren.filter((c) => c.name.toLowerCase().includes(q));
  }, [activeChildren, query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            className={styles.panel}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Catalog"
            aria-modal="true"
          >
            {/* Top toolbar: title + search + close */}
            <div className={styles.toolbar}>
              <div className={styles.toolbarTitle}>
                <Sparkles size={16} className={styles.toolbarTitleIcon} />
                <span>Catalog</span>
              </div>
              <div className={styles.toolbarSearch}>
                <Search size={14} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search categories…"
                  className={styles.toolbarSearchInput}
                />
                {query && (
                  <button
                    type="button"
                    className={styles.toolbarSearchClear}
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className={styles.toolbarClose}
                aria-label="Close catalog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body: rail (left) + content (right) */}
            <div className={styles.body}>
              {departments.length === 0 ? (
                <div className={styles.skeleton}>
                  <div className={styles.skeletonRail}>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className={styles.skeletonRailItem}>
                        <div className={styles.skeletonDot} />
                        <div className={styles.skeletonBar} style={{ width: `${50 + (i * 13) % 35}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className={styles.skeletonContent}>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className={styles.skeletonBar} style={{ width: `${60 + (i * 11) % 30}%` }} />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <nav className={styles.rail} aria-label="Departments">
                    {filteredDepartments.map((dept) => {
                      const Icon = getIcon(dept.name);
                      const isActive = active?.id === dept.id;
                      return (
                        <button
                          key={dept.id}
                          type="button"
                          className={`${styles.railItem} ${isActive ? styles.railItemActive : ""}`}
                          onMouseEnter={() => setActiveId(dept.id)}
                          onFocus={() => setActiveId(dept.id)}
                          onClick={() => setActiveId(dept.id)}
                        >
                          <span className={styles.railIcon}>
                            <Icon size={16} />
                          </span>
                          <span className={styles.railLabel}>{dept.name}</span>
                          <ChevronRight size={14} className={styles.railArrow} />
                        </button>
                      );
                    })}
                    {filteredDepartments.length === 0 && (
                      <div className={styles.railEmpty}>
                        No departments match &ldquo;{query}&rdquo;
                      </div>
                    )}
                    <Link
                      href="/catalog"
                      onClick={onClose}
                      className={styles.railAll}
                    >
                      Browse all <ArrowRight size={14} />
                    </Link>
                  </nav>

                  <div className={styles.content}>
                    {active ? (
                      <motion.div
                        key={active.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.18 }}
                        className={styles.contentInner}
                      >
                        <div className={styles.contentHero}>
                          <div>
                            <span className={styles.contentEyebrow}>Department</span>
                            <h3 className={styles.contentTitle}>{active.name}</h3>
                            <p className={styles.contentMeta}>
                              {subtreeCount(active).toLocaleString("en-US")} products in stock
                            </p>
                          </div>
                          <Link
                            href={`/catalog/${active.slug}`}
                            onClick={onClose}
                            className={styles.contentCta}
                          >
                            Shop all
                            <ArrowRight size={14} />
                          </Link>
                        </div>

                        {filteredChildren.length > 0 ? (
                          <div className={styles.subGrid}>
                            {filteredChildren.map((child) => {
                              const Icon = getIcon(child.name);
                              const count = subtreeCount(child);
                              return (
                                <Link
                                  key={child.id}
                                  href={`/catalog/${child.slug}`}
                                  onClick={onClose}
                                  className={styles.subCard}
                                >
                                  <span className={styles.subCardIcon}>
                                    <Icon size={16} />
                                  </span>
                                  <span className={styles.subCardText}>
                                    <span className={styles.subCardName}>{child.name}</span>
                                    <span className={styles.subCardCount}>
                                      {count.toLocaleString("en-US")} items
                                    </span>
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        ) : (
                          <Link
                            href={`/catalog/${active.slug}`}
                            onClick={onClose}
                            className={styles.contentEmpty}
                          >
                            <Sparkles size={16} />
                            Browse all {subtreeCount(active).toLocaleString("en-US")} products in
                            {" "}{active.name} →
                          </Link>
                        )}

                        <div className={styles.promo}>
                          <div className={styles.promoCopy}>
                            <span className={styles.promoEyebrow}>Free EU shipping</span>
                            <span className={styles.promoTitle}>
                              On {active.name} orders over €100
                            </span>
                            <span className={styles.promoSub}>
                              Same-day dispatch · 30-day returns · 2-year warranty
                            </span>
                          </div>
                          <Link
                            href={`/catalog/${active.slug}`}
                            onClick={onClose}
                            className={styles.promoBtn}
                          >
                            Shop now <ArrowRight size={14} />
                          </Link>
                        </div>
                      </motion.div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
