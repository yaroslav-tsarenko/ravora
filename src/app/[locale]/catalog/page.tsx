"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { SlidersHorizontal, X, Sparkles, ChevronRight } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters/ProductFilters";
import { ProductSort } from "@/components/product/ProductSort/ProductSort";
import { ProductSkeleton } from "@/components/product/ProductSkeleton/ProductSkeleton";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import styles from "./catalog.module.css";

interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
  children?: CatalogCategory[];
}

function subtreeCount(cat: CatalogCategory): number {
  const own = cat._count?.products || 0;
  return own + (cat.children || []).reduce((s, c) => s + subtreeCount(c), 0);
}

function findCategoryName(cats: CatalogCategory[], slug: string): string | null {
  for (const c of cats) {
    if (c.slug === slug) return c.name;
    if (c.children) {
      const found = findCategoryName(c.children, slug);
      if (found) return found;
    }
  }
  return null;
}

export default function CatalogPage() {
  const t = useTranslations("product");
  const nav = useTranslations("nav");
  const searchParams = useSearchParams();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";
  const selectedBrand = searchParams.get("brand") || "";

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (updates.page === undefined && !updates.page) params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
    fetch("/api/products/brands")
      .then((res) => res.json())
      .then((data) => setBrands(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("sort", sort);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (inStock) params.set("inStock", "true");
    if (onSale) params.set("onSale", "true");
    if (selectedBrand) params.set("brand", selectedBrand);

    fetch(`/api/products?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, sort, category, minPrice, maxPrice, inStock, onSale, selectedBrand]);

  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  const activeFilterCount = [category, minPrice, maxPrice, inStock, onSale, selectedBrand].filter(Boolean).length;

  const topCategories = useMemo(() => {
    return [...categories]
      .map((c) => ({ ...c, total: subtreeCount(c) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [categories]);

  const selectedCategoryName = useMemo(
    () => (category ? findCategoryName(categories, category) : null),
    [category, categories]
  );

  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (category) activeChips.push({ label: selectedCategoryName || category, onRemove: () => updateParams({ category: "", page: "1" }) });
  if (selectedBrand) activeChips.push({ label: selectedBrand, onRemove: () => updateParams({ brand: "", page: "1" }) });
  if (minPrice) activeChips.push({ label: `Min €${minPrice}`, onRemove: () => updateParams({ minPrice: "", page: "1" }) });
  if (maxPrice) activeChips.push({ label: `Max €${maxPrice}`, onRemove: () => updateParams({ maxPrice: "", page: "1" }) });
  if (inStock) activeChips.push({ label: "In stock", onRemove: () => updateParams({ inStock: "", page: "1" }) });
  if (onSale) activeChips.push({ label: "On sale", onRemove: () => updateParams({ onSale: "", page: "1" }) });

  const clearAll = () => {
    router.push("?");
  };

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs
        items={[
          { label: nav("home"), href: "/" },
          { label: nav("catalog") },
        ]}
      />

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroEyebrow}>
            <Sparkles size={14} /> Full catalog
          </span>
          <h1 className={styles.heroTitle}>
            {selectedCategoryName ? selectedCategoryName : "Electrical materials & supplies"}
          </h1>
          <p className={styles.heroSub}>
            {total > 0
              ? `${total.toLocaleString("en-US")} certified products — filter by category, brand, price and availability.`
              : "Browse our certified inventory of cables, breakers, lighting, distribution panels and more."}
          </p>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroBlob} style={{ background: "radial-gradient(circle, rgba(255,90,0,0.45), transparent 60%)" }} />
          <div className={styles.heroBlob2} style={{ background: "radial-gradient(circle, rgba(0,163,255,0.5), transparent 60%)" }} />
        </div>
      </div>

      {topCategories.length > 0 && (
        <div className={styles.quickCats}>
          <Link
            href="/catalog"
            className={`${styles.quickCat} ${!category ? styles.quickCatActive : ""}`}
          >
            All
          </Link>
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog/${cat.slug}`}
              className={`${styles.quickCat} ${category === cat.slug ? styles.quickCatActive : ""}`}
            >
              {cat.name}
              <span className={styles.quickCatCount}>{cat.total}</span>
            </Link>
          ))}
          <Link href="/catalog" className={styles.quickCatMore}>
            All categories <ChevronRight size={14} />
          </Link>
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{selectedCategoryName || nav("catalog")}</h2>
          <p className={styles.headerSub}>
            {t("showing", { count: products.length, total })}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className={styles.filtersBtn}
            type="button"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className={styles.filterBadge}>{activeFilterCount}</span>
            )}
          </button>
          <ProductSort value={sort} onChange={(v) => updateParams({ sort: v, page: "1" })} />
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className={styles.chipsRow}>
          <span className={styles.chipsLabel}>Active filters:</span>
          {activeChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.onRemove}
              className={styles.chip}
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
          <button type="button" onClick={clearAll} className={styles.clearAll}>
            Clear all
          </button>
        </div>
      )}

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <ProductFilters
            categories={categories}
            selectedCategory={category}
            minPrice={minPrice}
            maxPrice={maxPrice}
            inStock={inStock}
            onSale={onSale}
            brands={brands}
            selectedBrand={selectedBrand}
            onCategoryChange={(v) => updateParams({ category: v, page: "1" })}
            onMinPriceChange={(v) => updateParams({ minPrice: v, page: "1" })}
            onMaxPriceChange={(v) => updateParams({ maxPrice: v, page: "1" })}
            onInStockChange={(v) => updateParams({ inStock: v ? "true" : "", page: "1" })}
            onSaleChange={(v) => updateParams({ onSale: v ? "true" : "", page: "1" })}
            onBrandChange={(v) => updateParams({ brand: v, page: "1" })}
          />
        </aside>

        <div className={styles.content}>
          {loading ? (
            <ProductSkeleton count={12} />
          ) : products.length === 0 ? (
            <EmptyState
              title={t("filterBy")}
              subtitle={t("priceRange")}
              actionLabel={nav("home")}
              actionHref="/"
            />
          ) : (
            <>
              <ProductGrid products={products} />
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => updateParams({ page: String(page - 1) })}
                    disabled={page <= 1}
                    className={`${styles.pageBtn} ${styles.pageBtnEdge} ${page <= 1 ? styles.pageBtnDisabled : ""}`}
                  >
                    Prev
                  </button>
                  {(() => {
                    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (page > 3) pages.push("ellipsis-start");
                      const start = Math.max(2, page - 1);
                      const end = Math.min(totalPages - 1, page + 1);
                      for (let i = start; i <= end; i++) pages.push(i);
                      if (page < totalPages - 2) pages.push("ellipsis-end");
                      pages.push(totalPages);
                    }
                    return pages.map((p) =>
                      typeof p === "string" ? (
                        <span key={p} className={styles.pageEllipsis}>…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => updateParams({ page: String(p) })}
                          className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}
                  <button
                    onClick={() => updateParams({ page: String(page + 1) })}
                    disabled={page >= totalPages}
                    className={`${styles.pageBtn} ${styles.pageBtnEdge} ${page >= totalPages ? styles.pageBtnDisabled : ""}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filters overlay */}
      {mobileFiltersOpen && (
        <div className={styles.overlay}>
          <div className={styles.overlayBackdrop} onClick={() => setMobileFiltersOpen(false)} />
          <div className={styles.overlaySheet}>
            <div className={styles.overlayHeader}>
              <span className={styles.overlayTitle}>Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className={styles.overlayClose}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <ProductFilters
              categories={categories}
              selectedCategory={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              inStock={inStock}
              onSale={onSale}
              brands={brands}
              selectedBrand={selectedBrand}
              onCategoryChange={(v) => { updateParams({ category: v, page: "1" }); setMobileFiltersOpen(false); }}
              onMinPriceChange={(v) => updateParams({ minPrice: v, page: "1" })}
              onMaxPriceChange={(v) => updateParams({ maxPrice: v, page: "1" })}
              onInStockChange={(v) => updateParams({ inStock: v ? "true" : "", page: "1" })}
              onSaleChange={(v) => updateParams({ onSale: v ? "true" : "", page: "1" })}
              onBrandChange={(v) => { updateParams({ brand: v, page: "1" }); setMobileFiltersOpen(false); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
