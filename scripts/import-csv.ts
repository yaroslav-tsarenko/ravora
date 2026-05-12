import fs from "fs";
import path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString =
  process.env.DIRECT_URL ||
  "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split("\n").filter((l) => l.trim());
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });
    rows.push(row);
  }
  return rows;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  const csvPath = path.resolve(__dirname, "../data/products.csv");
  const csvText = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCSV(csvText);

  console.log(`Parsed ${rows.length} products from CSV`);

  const categoryMap = new Map<string, string>();

  const categoryNames: Record<string, string> = {
    electronics: "Electronics",
    clothing: "Clothing",
    home: "Home & Garden",
    sports: "Sports & Outdoors",
  };

  for (const [slug, name] of Object.entries(categoryNames)) {
    const cat = await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug, isActive: true, sortOrder: Object.keys(categoryNames).indexOf(slug) },
    });
    categoryMap.set(slug, cat.id);
  }

  console.log(`Ensured ${categoryMap.size} categories`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const row of rows) {
    try {
      const slug = slugify(row.name);
      const price = parseFloat(row.price);
      const comparePrice = row.comparePrice ? parseFloat(row.comparePrice) : null;
      const quantity = parseInt(row.quantity) || 0;
      const isFeatured = row.isFeatured === "true";
      const categorySlug = row.category || "";
      const categoryId = categoryMap.get(categorySlug);

      const existing = await prisma.product.findUnique({ where: { sku: row.sku } });

      if (existing) {
        await prisma.product.update({
          where: { sku: row.sku },
          data: {
            name: row.name,
            price,
            comparePrice,
            quantity,
            description: row.description,
            shortDescription: row.shortDescription,
            brand: row.brand || null,
            status: (row.status as "ACTIVE" | "DRAFT") || "ACTIVE",
            condition: row.condition || "new",
            isFeatured,
          },
        });
        updated++;
      } else {
        const product = await prisma.product.create({
          data: {
            name: row.name,
            slug,
            sku: row.sku,
            price,
            comparePrice,
            quantity,
            description: row.description,
            shortDescription: row.shortDescription,
            brand: row.brand || null,
            status: (row.status as "ACTIVE" | "DRAFT") || "ACTIVE",
            condition: row.condition || "new",
            isFeatured,
          },
        });

        if (categoryId) {
          await prisma.productCategory.create({
            data: { productId: product.id, categoryId },
          });
        }

        if (row.imageUrl) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: row.imageUrl,
              alt: row.name,
              sortOrder: 0,
            },
          });
        }

        created++;
      }
    } catch (err) {
      errors++;
      console.error(`Error importing ${row.sku}: ${err instanceof Error ? err.message : err}`);
    }
  }

  console.log(`\nImport complete:`);
  console.log(`  Created: ${created}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Errors: ${errors}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
