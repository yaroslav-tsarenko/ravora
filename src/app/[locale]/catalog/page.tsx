"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters/ProductFilters";
import { ProductSort } from "@/components/product/ProductSort/ProductSort";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState/EmptyState";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";

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

  const activeFilterCount = [category, minPrice, maxPrice, inStock, onSale, selectedBrand].filter(Boolean).length;

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem" }}>
      <Breadcrumbs
        items={[
          { label: nav("home"), href: "/" },
          { label: nav("catalog") },
        ]}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{nav("catalog")}</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
            {t("showing", { count: products.length, total })}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 1rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--color-text-secondary)",
            }}
            className="lg-hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{
                background: "var(--color-accent)",
                color: "white",
                borderRadius: "var(--radius-pill)",
                padding: "0.0625rem 0.375rem",
                fontSize: "0.6875rem",
                fontWeight: 700,
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>
          <ProductSort value={sort} onChange={(v) => updateParams({ sort: v, page: "1" })} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "2rem" }}>
        <aside style={{ position: "sticky", top: "calc(var(--header-height) + var(--announcement-height) + 1rem)", alignSelf: "start" }}>
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

        <div>
          {loading ? (
            <LoadingSpinner label={t("sortBy")} />
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
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.375rem", marginTop: "2.5rem" }}>
                  <button
                    onClick={() => updateParams({ page: String(page - 1) })}
                    disabled={page <= 1}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg)",
                      cursor: page <= 1 ? "not-allowed" : "pointer",
                      opacity: page <= 1 ? 0.5 : 1,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--color-text)",
                    }}
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParams({ page: String(p) })}
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        borderRadius: "var(--radius-lg)",
                        border: p === page ? "none" : "1px solid var(--color-border)",
                        background: p === page ? "var(--color-accent)" : "var(--color-bg)",
                        color: p === page ? "white" : "var(--color-text)",
                        cursor: "pointer",
                        fontSize: "0.8125rem",
                        fontWeight: p === page ? 700 : 500,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => updateParams({ page: String(page + 1) })}
                    disabled={page >= totalPages}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg)",
                      cursor: page >= totalPages ? "not-allowed" : "pointer",
                      opacity: page >= totalPages ? 0.5 : 1,
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--color-text)",
                    }}
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
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: "80vh",
            background: "var(--color-bg)",
            borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0",
            overflow: "auto",
            padding: "1.5rem",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span style={{ fontWeight: 700, fontSize: "1.125rem" }}>Filters</span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                style={{ width: "2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-lg)", border: "none", background: "var(--color-bg-tertiary)", cursor: "pointer", color: "var(--color-text)" }}
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
