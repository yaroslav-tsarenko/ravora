import { prisma } from "@/lib/prisma";
import { HeroBanner } from "@/components/home/HeroBanner/HeroBanner";
import { PromoBar } from "@/components/home/PromoBar/PromoBar";
import { FeaturedProducts } from "@/components/home/FeaturedProducts/FeaturedProducts";
import { CategoryShowcase } from "@/components/home/CategoryShowcase/CategoryShowcase";
import { NewArrivals } from "@/components/home/NewArrivals/NewArrivals";
import { PromoBanner } from "@/components/home/PromoBanner/PromoBanner";
import { WhyShopWithUs } from "@/components/home/WhyShopWithUs/WhyShopWithUs";
import { Newsletter } from "@/components/home/Newsletter/Newsletter";
import { JsonLd } from "@/components/shared/SEO/JsonLd";

export const dynamic = "force-dynamic";

async function getHomeData() {
  try {
    const [featuredProducts, categories, newArrivals] = await Promise.all([
      prisma.product.findMany({
        where: { status: "ACTIVE", isFeatured: true },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          categories: { include: { category: { select: { name: true } } } },
        },
        take: 8,
      }),
      prisma.category.findMany({
        where: { isActive: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
        take: 8,
      }),
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          categories: { include: { category: { select: { name: true } } } },
        },
        take: 8,
      }),
    ]);
    return { featuredProducts, categories, newArrivals };
  } catch {
    return { featuredProducts: [], categories: [], newArrivals: [] };
  }
}

export default async function HomePage() {
  const { featuredProducts, categories, newArrivals } = await getHomeData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Store",
          url: siteUrl,
          description: "Quality products delivered worldwide",
        }}
      />
      <HeroBanner />
      <PromoBar />
      {featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts as unknown as Parameters<typeof FeaturedProducts>[0]["products"]} />
      )}
      {categories.length > 0 && <CategoryShowcase categories={categories} />}
      <PromoBanner />
      {newArrivals.length > 0 && (
        <NewArrivals products={newArrivals as unknown as Parameters<typeof NewArrivals>[0]["products"]} />
      )}
      <WhyShopWithUs />
      <Newsletter />
    </>
  );
}
