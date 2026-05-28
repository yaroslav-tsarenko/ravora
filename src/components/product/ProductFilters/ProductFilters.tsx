"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./ProductFilters.module.css";

interface Category {
  id: string;
  name: string;
  slug: string;
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
        <ul className={styles.categoryList}>
          <li
            className={`${styles.categoryItem} ${!selectedCategory ? styles.categoryItemActive : ""}`}
            onClick={() => onCategoryChange("")}
          >
            {nav("allCategories")}
          </li>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className={`${styles.categoryItem} ${selectedCategory === cat.slug ? styles.categoryItemActive : ""}`}
              onClick={() => onCategoryChange(cat.slug)}
            >
              {cat.name}
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title={t("priceRange")}>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className={styles.priceInput}
          />
          <span className={styles.priceSep}>–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className={styles.priceInput}
          />
        </div>
        <div className={styles.pricePresets}>
          <button className={styles.presetBtn} onClick={() => { onMinPriceChange(""); onMaxPriceChange("25"); }}>Under €25</button>
          <button className={styles.presetBtn} onClick={() => { onMinPriceChange("25"); onMaxPriceChange("50"); }}>€25–€50</button>
          <button className={styles.presetBtn} onClick={() => { onMinPriceChange("50"); onMaxPriceChange("100"); }}>€50–€100</button>
          <button className={styles.presetBtn} onClick={() => { onMinPriceChange("100"); onMaxPriceChange(""); }}>€100+</button>
        </div>
      </FilterSection>

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
