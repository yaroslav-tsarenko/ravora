"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters/ProductFilters";
import { ProductSort } from "@/components/product/ProductSort/ProductSort";
import { ProductSkeleton } from "@/components/product/ProductSkeleton/ProductSkeleton";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import styles from "./catalog.module.css";

export default function CatalogPage() {
  const t = useTranslations("product");
  const nav = useTranslations("nav");
  const searchParams = useSearchParams();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
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
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  useEffect(() => { setSearchInput(search); }, [search]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      if (!("page" in updates)) params.set("page", "1");
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      updateParams({ search: value, page: "1" });
    }, 350);
  };

  const clearAll = () => {
    setSearchInput("");
    router.push("?");
  };

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
    if (search) params.set("search", search);

    fetch(`/api/products?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, sort, category, minPrice, maxPrice, inStock, onSale, selectedBrand, search]);

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

  const activeFilterCount = [category, minPrice, maxPrice, inStock, onSale, selectedBrand, search].filter(Boolean).length;

  const view = (() => {
    if (search) return { title: `Search: "${search}"`, subtitle: t("showing", { count: products.length, total }) };
    if (onSale) return { title: "Sale", subtitle: "Discounted products across the catalog" };
    if (sort === "popular") return { title: "Best Sellers", subtitle: "Most ordered products" };
    if (selectedBrand) return { title: selectedBrand, subtitle: `Products by ${selectedBrand}` };
    if (searchParams.has("sort") && sort === "newest") return { title: "New Arrivals", subtitle: "Just landed in store" };
    return { title: nav("catalog"), subtitle: t("showing", { count: products.length, total }) };
  })();

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs
        items={[
          { label: nav("home"), href: "/" },
          ...(view.title !== nav("catalog")
            ? [{ label: nav("catalog"), href: "/catalog" }, { label: view.title }]
            : [{ label: nav("catalog") }]),
        ]}
      />

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{view.title}</h1>
          <p className={styles.headerSub}>{view.subtitle}</p>
        </div>
        <div className={styles.headerActions}>
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 0 }}>
            <Search
              size={14}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-tertiary)",
                pointerEvents: "none",
              }}
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem 0.5rem 2rem",
                border: "1.5px solid var(--color-border)",
                borderRadius: 10,
                background: "var(--color-bg)",
                color: "var(--color-text)",
                fontSize: "0.8125rem",
                outline: "none",
              }}
            />
          </div>
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
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              type="button"
              style={{
                padding: "0.5rem 0.75rem",
                border: "1.5px solid var(--color-border)",
                borderRadius: 10,
                background: "transparent",
                color: "var(--color-text-secondary)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <X size={14} /> Clear
            </button>
          )}
          <ProductSort value={sort} onChange={(v) => updateParams({ sort: v, page: "1" })} />
        </div>
      </div>

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
