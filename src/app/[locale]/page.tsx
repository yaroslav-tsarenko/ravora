import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/shared/SEO/JsonLd";
import { MarketplaceHome } from "@/components/home/MarketplaceHome/MarketplaceHome";

export const dynamic = "force-dynamic";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

async function getHomeData() {
  try {
    const productInclude = {
      images: { orderBy: { sortOrder: "asc" as const }, take: 1 },
      categories: {
        include: { category: { select: { name: true, slug: true } } },
      },
    };

    const [featured, newest, onSale, popular, allProducts, categories] =
      await Promise.all([
        prisma.product.findMany({
          where: { status: "ACTIVE", isFeatured: true },
          include: productInclude,
          take: 10,
        }),
        prisma.product.findMany({
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          include: productInclude,
          take: 10,
        }),
        prisma.product.findMany({
          where: {
            status: "ACTIVE",
            comparePrice: { not: null },
          },
          include: productInclude,
          take: 10,
        }),
        prisma.product.findMany({
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "asc" },
          include: productInclude,
          take: 10,
        }),
        prisma.product.findMany({
          where: { status: "ACTIVE" },
          include: productInclude,
          take: 20,
        }),
        prisma.category.findMany({
          where: { isActive: true, parentId: null },
          orderBy: { sortOrder: "asc" },
          include: { _count: { select: { products: true } } },
        }),
      ]);

    return serialize({ featured, newest, onSale, popular, allProducts, categories });
  } catch {
    return { featured: [], newest: [], onSale: [], popular: [], allProducts: [], categories: [] };
  }
}

export default async function HomePage() {
  const data = await getHomeData();
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
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <MarketplaceHome data={data as any} />
    </>
  );
}
