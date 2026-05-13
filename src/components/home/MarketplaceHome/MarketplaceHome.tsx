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

interface BannerData {
  id: string;
  type: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  ctaLabel?: string | null;
  bgColor: string;
  textColor: string;
  badgeText?: string | null;
  oldPrice?: string | null;
  newPrice?: string | null;
  discountText?: string | null;
}

interface SectionData {
  id: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  filterType: string;
  categorySlug?: string | null;
  maxProducts: number;
  viewAllUrl?: string | null;
  viewAllLabel: string;
  bgStyle: string;
  columns: number;
}

interface TabData {
  id: string;
  label: string;
  icon?: string | null;
  linkUrl: string;
  color: string;
}

interface UtilityLinkData {
  id: string;
  label: string;
  linkUrl: string;
  icon?: string | null;
  position: string;
}

interface PromoStripData {
  id: string;
  icon: string;
  title: string;
  subtitle?: string | null;
  linkUrl?: string | null;
}

interface BrandData {
  id: string;
  name: string;
  logoUrl?: string | null;
  linkUrl?: string | null;
}

interface Props {
  data: {
    heroSlides: BannerData[];
    dealCards: BannerData[];
    promoSmall: BannerData[];
    promoWide: BannerData[];
    brands: BrandData[];
    sections: SectionData[];
    tabs: TabData[];
    utilityLinks: UtilityLinkData[];
    promoStripItems: PromoStripData[];
    sectionProducts: Record<string, Product[]>;
    categories: { id: string; name: string; slug: string; _count: { products: number } }[];
  };
}

export function MarketplaceHome({ data }: Props) {
  const {
    heroSlides, dealCards, promoSmall, promoWide,
    brands, sections, tabs, utilityLinks, promoStripItems,
    sectionProducts,
  } = data;

  return (
    <div className={styles.marketplace}>
      <TopBar links={utilityLinks} />
      <PromoStrip items={promoStripItems} />

      <div className={styles.container}>
        <div className={styles.mainLayout}>
          <div className={styles.sidebarDesktop}>
            <CategorySidebar />
          </div>

          <div className={styles.content}>
            <div className={styles.mobileCategories}>
              <CategorySidebar />
            </div>

            {tabs.length > 0 && <HorizontalTabs tabs={tabs} />}
            <HeroCarousel slides={heroSlides} deals={dealCards} />
            <PromoBannerGrid smallBanners={promoSmall} wideBanners={promoWide} />
            {brands.length > 0 && <BrandStrip brands={brands} />}

            {sections.map((section) => {
              const products = sectionProducts[section.slug] || [];
              if (!products.length) return null;
              return (
                <ProductSection
                  key={section.id}
                  title={section.title}
                  products={products}
                  viewAllHref={section.viewAllUrl || "/catalog"}
                  bg={section.bgStyle as "white" | "gray"}
                  columns={section.columns}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
