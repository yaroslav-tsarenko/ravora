export interface HomepageProduct {
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
  createdAt?: string | Date;
}

export interface HomepageCategoryChild {
  id: string;
  name: string;
  slug: string;
  childSlugs?: string[];
}

export interface HomepageCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  children?: HomepageCategoryChild[];
  _count?: { products: number };
}

export interface SubcategoryTab {
  label: string;
  slugs: string[];
}

export function getFeaturedProducts(products: HomepageProduct[], limit = 10): HomepageProduct[] {
  return products.filter((p) => p.isFeatured).slice(0, limit);
}

export function getSaleProducts(products: HomepageProduct[], limit = 10): HomepageProduct[] {
  return products
    .filter((p) => {
      if (!p.comparePrice) return false;
      return Number(p.comparePrice) > Number(p.price);
    })
    .sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a))
    .slice(0, limit);
}

export function getNewProducts(products: HomepageProduct[], limit = 10): HomepageProduct[] {
  return [...products]
    .sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    })
    .slice(0, limit);
}

export function getPopularProducts(products: HomepageProduct[], limit = 10): HomepageProduct[] {
  return [...products]
    .sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0))
    .slice(0, limit);
}

export function getProductsByCategory(products: HomepageProduct[], categorySlug: string): HomepageProduct[] {
  return products.filter((p) =>
    p.categories?.some((c) => c.category.slug === categorySlug)
  );
}

export function getProductsByBrand(products: HomepageProduct[], brandName: string): HomepageProduct[] {
  return products.filter((p) => p.brand?.toLowerCase() === brandName.toLowerCase());
}

export function getDiscountPercent(product: HomepageProduct): number {
  const price = Number(product.price);
  const compare = product.comparePrice ? Number(product.comparePrice) : null;
  if (!compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}

export interface CategorySection {
  category: HomepageCategory;
  products: HomepageProduct[];
  subcategoryTabs: SubcategoryTab[];
}

function hasProductInSlugs(products: HomepageProduct[], slugs: string[]): boolean {
  if (slugs.length === 0) return false;
  const slugSet = new Set(slugs);
  return products.some((p) =>
    p.categories?.some((c) => slugSet.has(c.category.slug))
  );
}

export function getHomepageCategorySections(
  products: HomepageProduct[],
  categories: HomepageCategory[],
  maxPerCategory = 10,
  maxSections?: number,
): CategorySection[] {
  const sections = categories
    .map((cat) => {
      const allChildSlugs = (cat.children || []).flatMap((ch) => [
        ch.slug,
        ...(ch.childSlugs || []),
      ]);
      const allRelevantSlugs = [cat.slug, ...allChildSlugs];
      const slugSet = new Set(allRelevantSlugs);

      const unique = products.filter((p) =>
        p.categories?.some((c) => slugSet.has(c.category.slug))
      );

      const childTabs: SubcategoryTab[] = (cat.children || [])
        .map((child) => {
          const childSlugs = [child.slug, ...(child.childSlugs || [])];
          return { label: child.name, slugs: childSlugs };
        })
        .filter((tab) => hasProductInSlugs(unique, tab.slugs));

      const subcategoryTabs: SubcategoryTab[] = childTabs.length > 0
        ? [{ label: "All", slugs: allRelevantSlugs }, ...childTabs]
        : [];

      return {
        category: cat,
        products: unique.slice(0, maxPerCategory),
        subcategoryTabs,
        totalCount: unique.length,
      };
    })
    .filter((s) => s.products.length > 0)
    .sort((a, b) => b.totalCount - a.totalCount);

  const limited = maxSections ? sections.slice(0, maxSections) : sections;
  return limited.map(({ totalCount: _, ...rest }) => rest);
}

export interface BrandSection {
  brand: string;
  products: HomepageProduct[];
}

export function getBrandSections(
  products: HomepageProduct[],
  brandNames: string[],
  limit = 8,
): BrandSection[] {
  return brandNames
    .map((brand) => ({
      brand,
      products: getProductsByBrand(products, brand).slice(0, limit),
    }))
    .filter((s) => s.products.length > 0);
}

export const TOP_BRANDS = [
  "Apple", "Samsung", "Sony", "Nike", "Adidas",
  "Dyson", "Garmin", "The North Face", "Bose", "LG",
  "KitchenAid", "Under Armour", "Lenovo", "ASUS",
];
