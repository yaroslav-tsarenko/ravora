/**
 * Re-link already-imported BigBuy products to their proper sub-categories.
 *
 * Background:
 *   The original import called /rest/catalog/productscategories.json and tried
 *   to pick the product id from the row, but BigBuy returns
 *   `{ id, product, category, position }` where `id` is the category id —
 *   not the product id. The importer picked `id` first and ended up using a
 *   handful of distinct keys instead of one per product, so 99% of products
 *   fell through to the Electronics root only.
 *
 * This script fixes that without touching the main importer:
 *   1. Rebuild taxonomy → DB Category mapping by slug (same slugify rule).
 *   2. Refetch productscategories.json with parentTaxonomy=19653.
 *   3. For every product known to come from BigBuy (metadata.source = "bigbuy"),
 *      attach it to its leaf categories AND their level-2 ancestor
 *      (the "subcategory" directly under Electronics). The Electronics root
 *      link is preserved as a fallback.
 *
 * Run:
 *   npx tsx scripts/fix-bigbuy-categories.ts \
 *     --database-url 'postgresql://…neon…'
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { BigBuyClient, pick } from "../src/lib/bigbuy/client";

const ROOT_TAX_ID = 19653;
const ISO = "en";
const PAGE_SIZE = 5000;

const args = process.argv.slice(2);
const argVal = (f: string) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};

const connectionString =
  argVal("--database-url") ||
  process.env.BIGBUY_TARGET_DATABASE_URL ||
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL / DATABASE_URL not set");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const log = (m: string) => console.log(m);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

type Tax = { id: number; parentTaxonomy: number | null; name: string };

async function main() {
  const token = process.env.BIGBUY_API_PRODUCTION;
  if (!token) throw new Error("BIGBUY_API_PRODUCTION missing");
  const client = new BigBuyClient({ token, env: "production", log });

  // 1. taxonomies and slug→category mapping
  log("① Fetching taxonomies…");
  const taxonomies = await client.getTaxonomies(ISO);
  const byId = new Map<number, Tax & { _children: Tax[] }>();
  for (const t of taxonomies) {
    const id = Number(pick(t, ["id", "taxonomyId", "categoryId"]));
    if (!Number.isFinite(id)) continue;
    const parent = pick(t, ["parentTaxonomy", "parent", "parentId", "idParent"]);
    const parentN =
      parent == null ? null : Number(parent);
    const name = String(pick(t, ["name", "title"]) ?? `Category ${id}`).trim();
    byId.set(id, {
      id,
      parentTaxonomy: Number.isFinite(parentN) ? (parentN as number) : null,
      name,
      _children: [],
    });
  }
  for (const t of byId.values()) {
    if (t.parentTaxonomy != null && byId.has(t.parentTaxonomy)) {
      byId.get(t.parentTaxonomy)!._children.push(t);
    }
  }

  const root = byId.get(ROOT_TAX_ID);
  if (!root) throw new Error(`Root taxonomy #${ROOT_TAX_ID} not found`);
  const subtree: (Tax & { _children: Tax[] })[] = [];
  const walk = (n: typeof root) => {
    subtree.push(n);
    n._children.forEach((c) => walk(c as typeof root));
  };
  walk(root);
  log(`  subtree size: ${subtree.length}`);

  // recompute slugs the SAME way the importer did, so we can look up DB categories
  const depthOf = (n: Tax): number => {
    let d = 0;
    let p = n.parentTaxonomy;
    while (p != null && byId.has(p)) {
      d++;
      p = byId.get(p)!.parentTaxonomy;
    }
    return d;
  };
  const ordered = [...subtree].sort((a, b) => depthOf(a) - depthOf(b));
  const usedSlugs = new Set<string>();
  const taxToSlug = new Map<number, string>();
  for (const t of ordered) {
    let slug = slugify(t.name) || `cat-${t.id}`;
    if (usedSlugs.has(slug)) slug = `${slug}-${t.id}`;
    usedSlugs.add(slug);
    taxToSlug.set(t.id, slug);
  }

  const cats = await prisma.category.findMany({
    where: { slug: { in: [...taxToSlug.values()] } },
    select: { id: true, slug: true },
  });
  const slugToCatId = new Map(cats.map((c) => [c.slug, c.id]));
  const taxToCatId = new Map<number, string>();
  for (const [taxId, slug] of taxToSlug) {
    if (slugToCatId.has(slug)) taxToCatId.set(taxId, slugToCatId.get(slug)!);
  }
  log(`  mapped ${taxToCatId.size}/${subtree.length} taxonomies to DB categories`);

  // level-2 ancestor lookup (direct child of root)
  const taxToLevel2 = new Map<number, number>();
  for (const t of subtree) {
    let cur: (Tax & { _children: Tax[] }) | undefined = t;
    const path: number[] = [];
    while (cur && cur.id !== ROOT_TAX_ID) {
      path.unshift(cur.id);
      cur = cur.parentTaxonomy != null ? byId.get(cur.parentTaxonomy) : undefined;
    }
    if (path.length) taxToLevel2.set(t.id, path[0]);
  }

  // 2. load BigBuy products from DB
  log("② Loading BigBuy products from DB…");
  const products = await prisma.product.findMany({
    where: { metadata: { path: ["source"], equals: "bigbuy" } },
    select: { id: true, metadata: true },
  });
  const bigbuyIdToDb = new Map<number, string>();
  for (const p of products) {
    const meta = p.metadata as { bigbuyId?: number } | null;
    if (meta && typeof meta.bigbuyId === "number") {
      bigbuyIdToDb.set(meta.bigbuyId, p.id);
    }
  }
  log(`  loaded ${bigbuyIdToDb.size} bigbuy products`);

  // 3. fetch products.json — each row carries `taxonomy` (leaf taxonomy id) directly
  log("③ Fetching products.json (carries the taxonomy field per product)…");
  const allProducts: Array<Record<string, unknown>> = [];
  for (let page = 0; ; page++) {
    const batch = await client.get<Array<Record<string, unknown>>>(
      "/rest/catalog/products.json",
      { parentTaxonomy: ROOT_TAX_ID, page, pageSize: PAGE_SIZE }
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    allProducts.push(...batch);
    log(`  page ${page} → ${batch.length} (total ${allProducts.length})`);
    if (batch.length < PAGE_SIZE) break;
  }
  log(`  total products fetched: ${allProducts.length}`);

  // 4. build product → set of DB categoryIds
  const productCatLinks = new Map<string, Set<string>>();
  let noDbMatch = 0;
  let noTaxMatch = 0;
  for (const p of allProducts) {
    const bigBuyProdId = Number(pick(p, ["id", "productId"]));
    const dbProdId = bigbuyIdToDb.get(bigBuyProdId);
    if (!dbProdId) { noDbMatch++; continue; }
    const set = productCatLinks.get(dbProdId) ?? new Set<string>();

    // primary taxonomy on the product row
    const primary = Number(pick(p, ["taxonomy"]));
    const candidates = new Set<number>();
    if (Number.isFinite(primary)) candidates.add(primary);
    // some rows also carry `taxonomies` as an array
    const list = pick<unknown[]>(p, ["taxonomies"]);
    if (Array.isArray(list)) {
      for (const v of list) {
        const n = Number(v);
        if (Number.isFinite(n)) candidates.add(n);
      }
    }

    let matched = false;
    for (const taxId of candidates) {
      const dbCatId = taxToCatId.get(taxId);
      if (dbCatId) { set.add(dbCatId); matched = true; }
      const lvl2 = taxToLevel2.get(taxId);
      if (lvl2 != null) {
        const ancCatId = taxToCatId.get(lvl2);
        if (ancCatId) set.add(ancCatId);
      }
    }
    if (!matched) noTaxMatch++;
    if (set.size > 0) productCatLinks.set(dbProdId, set);
  }
  log(
    `  linkable products: ${productCatLinks.size}` +
      ` (skipped: ${noDbMatch} not in DB, ${noTaxMatch} with no taxonomy match)`
  );

  // also keep Electronics root as a safe fallback link
  const rootCatId = taxToCatId.get(ROOT_TAX_ID);

  // 5. apply links — bulk insert, skipDuplicates avoids touching the existing
  //    root link. Much faster than per-product deleteMany+createMany.
  log("④ Bulk-inserting category links…");
  const rows: { productId: string; categoryId: string }[] = [];
  for (const [productId, catIds] of productCatLinks) {
    if (rootCatId) catIds.add(rootCatId);
    for (const categoryId of catIds) rows.push({ productId, categoryId });
  }
  log(`  prepared ${rows.length} rows for ${productCatLinks.size} products`);

  const CHUNK = 5000;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const r = await prisma.productCategory.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    inserted += r.count;
    log(`  …${Math.min(i + CHUNK, rows.length)}/${rows.length} processed (new rows: ${inserted})`);
  }
  log(`\n✓ Done. Inserted ${inserted} new ProductCategory rows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect().catch(() => {});
  });
