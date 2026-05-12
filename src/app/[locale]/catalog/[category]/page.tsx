import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid/ProductGrid";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";

export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{ category: string; locale: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" }, take: 1 },
              categories: { include: { category: { select: { name: true } } } },
            },
          },
        },
      },
    },
  });

  if (!category) notFound();

  const products = category.products
    .map((pc: { product: Record<string, unknown> }) => pc.product)
    .filter((p: Record<string, unknown>) => p.status === "ACTIVE");

  return (
    <div style={{ maxWidth: "var(--max-width)", margin: "0 auto", padding: "0 1rem" }}>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Catalog", href: "/catalog" },
          { label: category.name },
        ]}
      />

      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        {category.name}
      </h1>

      {category.description && (
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
          {category.description}
        </p>
      )}

      <ProductGrid products={products as unknown as Parameters<typeof ProductGrid>[0]["products"]} />
    </div>
  );
}
