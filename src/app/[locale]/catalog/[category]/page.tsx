import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { getDescendantCategoryIds } from "@/lib/category-tree";

export const revalidate = 60;

const PAGE_SIZE = 60;

interface CategoryPageProps {
  params: Promise<{ category: string; locale: string }>;
  searchParams?: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug, locale } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true, slug: true },
  });

  if (!category) return {};

  return {
    title: category.name,
    description:
      category.description ||
      `Shop ${category.name} products at MisaElectro. Browse electronics, accessories, electrical materials and installation supplies.`,
    alternates: { canonical: `/${locale}/catalog/${category.slug}` },
    openGraph: {
      title: `${category.name} | MisaElectro`,
      description:
        category.description ||
        `Shop ${category.name} products at MisaElectro.`,
      url: `/${locale}/catalog/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: slug, locale } = await params;
  const sp = (await searchParams) || {};
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true, description: true, slug: true },
  });

  if (!category) notFound();

  const categoryIds = await getDescendantCategoryIds(category.id);

  const where = {
    status: "ACTIVE" as const,
    images: { some: {} },
    categories: { some: { categoryId: { in: categoryIds } } },
  };

  const [productsRaw, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        comparePrice: true,
        quantity: true,
        images: {
          select: { url: true, alt: true },
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        categories: {
          select: { category: { select: { name: true } } },
          take: 1,
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const products = productsRaw.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    price: Number(p.price),
    comparePrice: p.comparePrice == null ? null : Number(p.comparePrice),
    quantity: p.quantity,
    images: p.images.map((i) => ({ url: i.url, alt: i.alt })),
    categories: p.categories.map((pc) => ({ category: { name: pc.category.name } })),
  }));

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const basePath = `/${locale}/catalog/${category.slug}`;

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem 3rem", overflowWrap: "anywhere" }}>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Catalog", href: "/catalog" },
          { label: category.name },
        ]}
      />

      <h1 style={{ fontSize: "clamp(1.25rem, 3.5vw, 1.75rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.75rem", wordBreak: "break-word" }}>
        {category.name}
      </h1>

      {category.description && (
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem", fontSize: "0.9375rem", lineHeight: 1.6 }}>
          {category.description}
        </p>
      )}

      <p style={{ color: "var(--color-text-tertiary)", marginBottom: "1.5rem", fontSize: "0.8125rem" }}>
        {total.toLocaleString()} product{total === 1 ? "" : "s"}
      </p>

      <ProductGrid products={products} />

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          style={{
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
            marginTop: "2rem",
            flexWrap: "wrap",
          }}
        >
          {page > 1 && (
            <a
              href={`${basePath}?page=${page - 1}`}
              style={{
                padding: "0.5rem 0.875rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-text)",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Previous
            </a>
          )}
          <span style={{ padding: "0.5rem 0.875rem", color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`${basePath}?page=${page + 1}`}
              style={{
                padding: "0.5rem 0.875rem",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                color: "var(--color-text)",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Next
            </a>
          )}
        </nav>
      )}
    </div>
  );
}
