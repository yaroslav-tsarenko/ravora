"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./ProductFilters.module.css";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
  children?: Category[];
}

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
  onSale: boolean;
  brands: string[];
  selectedBrand: string;
  onCategoryChange: (slug: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onInStockChange: (value: boolean) => void;
  onSaleChange: (value: boolean) => void;
  onBrandChange: (value: string) => void;
}

function FilterSection({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={styles.section}>
      <button className={styles.sectionHeader} onClick={() => setOpen(!open)}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className={styles.sectionContent}>{children}</div>}
    </div>
  );
}

function CategoryItem({
  cat,
  depth,
  selectedCategory,
  onCategoryChange,
}: {
  cat: Category;
  depth: number;
  selectedCategory: string;
  onCategoryChange: (slug: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = cat.children && cat.children.length > 0;
  const isActive = selectedCategory === cat.slug;
  const count = cat._count?.products || 0;

  return (
    <>
      <li
        className={`${styles.categoryItem} ${isActive ? styles.categoryItemActive : ""}`}
        style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
      >
        <span
          onClick={() => onCategoryChange(cat.slug)}
          style={{ flex: 1, cursor: "pointer" }}
        >
          {cat.name}
          {count > 0 && (
            <span style={{ color: "var(--color-text-tertiary)", fontSize: "0.75rem", marginLeft: "0.25rem" }}>
              ({count})
            </span>
          )}
        </span>
        {hasChildren && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--color-text-tertiary)", padding: "0.125rem", display: "flex",
            }}
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </li>
      {hasChildren && expanded && cat.children!.map((child) => (
        <CategoryItem
          key={child.id}
          cat={child}
          depth={depth + 1}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      ))}
    </>
  );
}

function PriceSection({
  title, minPrice, maxPrice, onMinPriceChange, onMaxPriceChange,
}: {
  title: string;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (v: string) => void;
  onMaxPriceChange: (v: string) => void;
}) {
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const minTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setLocalMin(minPrice); }, [minPrice]);
  useEffect(() => { setLocalMax(maxPrice); }, [maxPrice]);

  const debouncedMin = (v: string) => {
    setLocalMin(v);
    if (minTimer.current) clearTimeout(minTimer.current);
    minTimer.current = setTimeout(() => onMinPriceChange(v), 400);
  };
  const debouncedMax = (v: string) => {
    setLocalMax(v);
    if (maxTimer.current) clearTimeout(maxTimer.current);
    maxTimer.current = setTimeout(() => onMaxPriceChange(v), 400);
  };

  const applyPreset = (min: string, max: string) => {
    setLocalMin(min);
    setLocalMax(max);
    onMinPriceChange(min);
    onMaxPriceChange(max);
  };

  return (
    <FilterSection title={title}>
      <div className={styles.priceInputs}>
        <input
          type="number"
          placeholder="Min"
          value={localMin}
          onChange={(e) => debouncedMin(e.target.value)}
          className={styles.priceInput}
          min="0"
        />
        <span className={styles.priceSep}>–</span>
        <input
          type="number"
          placeholder="Max"
          value={localMax}
          onChange={(e) => debouncedMax(e.target.value)}
          className={styles.priceInput}
          min="0"
        />
      </div>
      <div className={styles.pricePresets}>
        <button className={styles.presetBtn} onClick={() => applyPreset("", "25")}>Under €25</button>
        <button className={styles.presetBtn} onClick={() => applyPreset("25", "50")}>€25–€50</button>
        <button className={styles.presetBtn} onClick={() => applyPreset("50", "100")}>€50–€100</button>
        <button className={styles.presetBtn} onClick={() => applyPreset("100", "")}>€100+</button>
      </div>
    </FilterSection>
  );
}

export function ProductFilters({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  inStock,
  onSale,
  brands,
  selectedBrand,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onInStockChange,
  onSaleChange,
  onBrandChange,
}: ProductFiltersProps) {
  const t = useTranslations("product");
  const nav = useTranslations("nav");

  return (
    <aside className={styles.filters}>
      <FilterSection title={t("filterBy")}>
        {categories.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonItem}>
                <div className={styles.skeletonBar} style={{ width: `${50 + (i * 19) % 40}%`, flex: 1 }} />
                <div className={styles.skeletonBar} style={{ width: "20px" }} />
              </div>
            ))}
          </div>
        ) : (
          <ul className={styles.categoryList}>
            <li
              className={`${styles.categoryItem} ${!selectedCategory ? styles.categoryItemActive : ""}`}
              onClick={() => onCategoryChange("")}
            >
              {nav("allCategories")}
            </li>
            {categories.map((cat) => (
              <CategoryItem
                key={cat.id}
                cat={cat}
                depth={0}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
              />
            ))}
          </ul>
        )}
      </FilterSection>

      <PriceSection
        title={t("priceRange")}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={onMinPriceChange}
        onMaxPriceChange={onMaxPriceChange}
      />

      {brands.length > 0 && (
        <FilterSection title="Brand" defaultOpen={false}>
          <ul className={styles.categoryList}>
            <li
              className={`${styles.categoryItem} ${!selectedBrand ? styles.categoryItemActive : ""}`}
              onClick={() => onBrandChange("")}
            >
              All Brands
            </li>
            {brands.map((brand) => (
              <li
                key={brand}
                className={`${styles.categoryItem} ${selectedBrand === brand ? styles.categoryItemActive : ""}`}
                onClick={() => onBrandChange(brand)}
              >
                {brand}
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      <FilterSection title={t("availability")} defaultOpen={false}>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={inStock} onChange={(e) => onInStockChange(e.target.checked)} />
          <span>{t("inStock")}</span>
        </label>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={onSale} onChange={(e) => onSaleChange(e.target.checked)} />
          <span>On Sale</span>
        </label>
      </FilterSection>
    </aside>
  );
}
