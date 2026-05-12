"use client";

import { TopBar } from "../TopBar/TopBar";
import { PromoStrip } from "../PromoStrip/PromoStrip";
import { CategorySidebar } from "../CategorySidebar/CategorySidebar";
import { HorizontalTabs } from "../HorizontalTabs/HorizontalTabs";
import { HeroCarousel } from "../HeroCarousel/HeroCarousel";
import { PromoBannerGrid } from "../PromoBannerGrid/PromoBannerGrid";
import { BrandStrip } from "../BrandStrip/BrandStrip";
import { ProductSection } from "../ProductSection/ProductSection";
import styles from "./MarketplaceHome.module.css";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  comparePrice?: number | string | null;
  images: { url: string; alt?: string | null }[];
  categories?: { category: { name: string; slug: string } }[];
  quantity?: number;
  status?: string;
  isFeatured?: boolean;
  brand?: string | null;
}

interface Props {
  data: {
    featured: Product[];
    newest: Product[];
    onSale: Product[];
    popular: Product[];
    allProducts: Product[];
    categories: { id: string; name: string; slug: string; _count: { products: number } }[];
  };
}

export function MarketplaceHome({ data }: Props) {
  const { featured, newest, onSale, popular, allProducts } = data;

  const electronicsProducts = allProducts.filter((p) =>
    p.categories?.some((c) => c.category.slug === "electronics")
  );
  const homeProducts = allProducts.filter((p) =>
    p.categories?.some((c) => c.category.slug === "home-garden")
  );

  return (
    <div className={styles.marketplace}>
      <TopBar />
      <PromoStrip />

      <div className={styles.container}>
        <div className={styles.mainLayout}>
          <div className={styles.sidebarDesktop}>
            <CategorySidebar />
          </div>

          <div className={styles.content}>
            <div className={styles.mobileCategories}>
              <CategorySidebar />
            </div>

            <HorizontalTabs />
            <HeroCarousel />
            <PromoBannerGrid />
            <BrandStrip />

            {onSale.length > 0 && (
              <ProductSection
                title="Best Deals"
                products={onSale.slice(0, 5)}
                viewAllHref="/catalog"
                tabs={["All", "Electronics", "Home", "Sports"]}
              />
            )}

            {featured.length > 0 && (
              <ProductSection
                title="Popular Products"
                products={featured.slice(0, 5)}
                viewAllHref="/catalog"
                bg="gray"
              />
            )}

            {newest.length > 0 && (
              <ProductSection
                title="New Arrivals"
                products={newest.slice(0, 5)}
                viewAllHref="/catalog"
                tabs={["Just In", "This Week", "This Month"]}
              />
            )}

            {electronicsProducts.length > 0 && (
              <ProductSection
                title="Electronics Deals"
                products={electronicsProducts.slice(0, 5)}
                viewAllHref="/catalog/electronics"
                bg="gray"
              />
            )}

            {popular.length > 0 && (
              <ProductSection
                title="Recommended For You"
                products={popular.slice(0, 5)}
                viewAllHref="/catalog"
              />
            )}

            {homeProducts.length > 0 && (
              <ProductSection
                title="Home Essentials"
                products={homeProducts.slice(0, 5)}
                viewAllHref="/catalog/home-garden"
                bg="gray"
              />
            )}

            {allProducts.length > 0 && (
              <ProductSection
                title="All Products"
                products={allProducts.slice(0, 10)}
                viewAllHref="/catalog"
                columns={5}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
