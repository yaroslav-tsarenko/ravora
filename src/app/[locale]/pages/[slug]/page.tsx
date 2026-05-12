import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;

  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page || !page.isActive) notFound();

  return (
    <div style={{ maxWidth: "48rem", margin: "0 auto", padding: "0 1rem 4rem" }}>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: page.title }]} />
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>{page.title}</h1>
      <div
        style={{ lineHeight: 1.8, color: "var(--color-text-secondary)" }}
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}
