/**
 * Import BigBuy electronics into the store.
 *
 *   npx tsx scripts/import-bigbuy.ts                 # full import (production key)
 *   npx tsx scripts/import-bigbuy.ts --dry-run       # fetch + report, no DB writes
 *   npx tsx scripts/import-bigbuy.ts --limit 200     # only first 200 products (testing)
 *   npx tsx scripts/import-bigbuy.ts --sandbox       # use BIGBUY_API_SANDBOX
 *   npx tsx scripts/import-bigbuy.ts --taxonomy 123  # force the Electronics taxonomy id
 *
 * What it does:
 *   1. Pulls BigBuy's taxonomy tree and locates the "Electronics" branch.
 *   2. Recreates that branch as Category + sub-Category rows.
 *   3. Pulls every product in the branch, applies a +10% markup on the BigBuy
 *      wholesale price (costPrice = wholesale, price = wholesale * 1.10),
 *      attaches English names/descriptions + images, links each product to its
 *      sub-category, and publishes it (status ACTIVE) so it shows on the site.
 *
 * Re-runnable: products upsert by SKU, categories by slug.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  BigBuyClient,
  pick,
  type BigBuyTaxonomy,
  type BigBuyProduct,
} from "../src/lib/bigbuy/client";

// ── config ────────────────────────────────────────────────────────────
const MARKUP = 1.1; // +10%
const ISO = "en";
const PAGE_SIZE = 5000; // BigBuy max is 10000
const DEFAULT_STOCK = 25; // fallback quantity when stock endpoint is unavailable
const ELECTRONICS_NAME_HINTS = [
  "electronic",
  "electronics",
  "electrónica",
  "electronica",
  "tech",
  "informática",
  "informatica",
];

// ── args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const has = (f: string) => args.includes(f);
const val = (f: string) => {
  const i = args.indexOf(f);
  return i >= 0 ? args[i + 1] : undefined;
};
const DRY_RUN = has("--dry-run");
const SANDBOX = has("--sandbox");
const LIMIT = val("--limit") ? parseInt(val("--limit")!, 10) : Infinity;
const FORCE_TAXONOMY = val("--taxonomy") ? parseInt(val("--taxonomy")!, 10) : undefined;
const DATABASE_URL_OVERRIDE = val("--database-url");

// ── helpers ───────────────────────────────────────────────────────────
const log = (m: string) => console.log(m);
const num = (v: unknown): number | undefined => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
};
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

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

// ── db ────────────────────────────────────────────────────────────────
const connectionString =
  DATABASE_URL_OVERRIDE ||
  process.env.BIGBUY_TARGET_DATABASE_URL ||
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL;
if (!connectionString && !DRY_RUN) {
  throw new Error("DIRECT_URL / DATABASE_URL not set in .env");
}
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: connectionString! }),
});

// ── taxonomy tree utilities ───────────────────────────────────────────
type TaxNode = BigBuyTaxonomy & { _children: TaxNode[] };

function taxId(t: BigBuyTaxonomy): number {
  return Number(pick(t, ["id", "taxonomyId", "categoryId"]));
}
function taxParent(t: BigBuyTaxonomy): number | null {
  const p = pick(t, ["parentTaxonomy", "parent", "parentId", "idParent"]);
  const n = p == null ? null : Number(p);
  return n && Number.isFinite(n) ? n : null;
}
function taxName(t: BigBuyTaxonomy): string {
  return String(pick(t, ["name", "title", "description"]) ?? `Category ${taxId(t)}`).trim();
}

function buildTree(taxonomies: BigBuyTaxonomy[]) {
  const byId = new Map<number, TaxNode>();
  for (const t of taxonomies) {
    const id = taxId(t);
    if (!Number.isFinite(id)) continue;
    byId.set(id, { ...t, _children: [] });
  }
  for (const node of byId.values()) {
    const p = taxParent(node);
    if (p != null && byId.has(p)) byId.get(p)!._children.push(node);
  }
  return byId;
}

function collectSubtree(root: TaxNode): TaxNode[] {
  const out: TaxNode[] = [];
  const walk = (n: TaxNode) => {
    out.push(n);
    n._children.forEach(walk);
  };
  walk(root);
  return out;
}

// ── pagination helper ─────────────────────────────────────────────────
async function fetchAllPages<T>(
  label: string,
  fn: (page: number) => Promise<T[]>
): Promise<T[]> {
  const all: T[] = [];
  for (let page = 0; ; page++) {
    let batch: T[];
    try {
      batch = await fn(page);
    } catch (err) {
      log(`  ${label}: page ${page} failed — ${(err as Error).message}`);
      break;
    }
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    log(`  ${label}: page ${page} → ${batch.length} (total ${all.length})`);
    if (batch.length < PAGE_SIZE) break;
    if (all.length >= LIMIT) break;
  }
  return all;
}

// ── main ──────────────────────────────────────────────────────────────
async function main() {
  const token = SANDBOX
    ? process.env.BIGBUY_API_SANDBOX
    : process.env.BIGBUY_API_PRODUCTION;
  if (!token) {
    throw new Error(
      `Missing ${SANDBOX ? "BIGBUY_API_SANDBOX" : "BIGBUY_API_PRODUCTION"} in .env`
    );
  }

  const client = new BigBuyClient({
    token,
    env: SANDBOX ? "sandbox" : "production",
    log,
  });

  log(`\n▶ BigBuy import (${SANDBOX ? "sandbox" : "production"})${DRY_RUN ? " [DRY RUN]" : ""}`);
  log(`  markup: +${Math.round((MARKUP - 1) * 100)}% on wholesale, language: ${ISO}\n`);

  // 1. taxonomies → tree
  log("① Fetching taxonomy tree…");
  const taxonomies = await client.getTaxonomies(ISO);
  log(`  got ${taxonomies.length} taxonomies`);
  const byId = buildTree(taxonomies);

  // locate Electronics root
  let rootId = FORCE_TAXONOMY;
  if (!rootId) {
    const candidates = [...byId.values()].filter((t) =>
      ELECTRONICS_NAME_HINTS.some((h) => taxName(t).toLowerCase().includes(h))
    );
    // prefer the highest-level (shallowest) match
    candidates.sort((a, b) => {
      const depth = (n: TaxNode): number => {
        let d = 0, p = taxParent(n);
        while (p != null && byId.has(p)) { d++; p = taxParent(byId.get(p)!); }
        return d;
      };
      return depth(a) - depth(b) || collectSubtree(b).length - collectSubtree(a).length;
    });
    if (candidates.length) {
      rootId = taxId(candidates[0]);
      log(`  Electronics candidates: ${candidates.slice(0, 5).map((c) => `${taxName(c)} (#${taxId(c)})`).join(", ")}`);
    }
  }
  if (!rootId || !byId.has(rootId)) {
    log("\n✗ Could not locate an Electronics taxonomy automatically.");
    log("  Top-level taxonomies were:");
    for (const t of byId.values()) {
      if (taxParent(t) == null) log(`    #${taxId(t)}  ${taxName(t)}`);
    }
    log("\n  Re-run with --taxonomy <id> using the correct id above.");
    return;
  }
  const root = byId.get(rootId)!;
  const subtree = collectSubtree(root).sort((a, b) => taxId(a) - taxId(b));
  log(`\n✓ Electronics root: "${taxName(root)}" (#${rootId}) — ${subtree.length} taxonomies in branch\n`);

  // 2. create category tree
  log("② Creating category tree…");
  const taxToCategoryId = new Map<number, string>();
  const taxToLevel2 = new Map<number, number>(); // tax id → its level-2 (subcategory) ancestor tax id
  const usedSlugs = new Set<string>();

  // precompute level-2 ancestor for every taxonomy in the branch
  for (const t of subtree) {
    let cur: TaxNode | undefined = t;
    const path: number[] = [];
    while (cur && taxId(cur) !== rootId) {
      path.unshift(taxId(cur));
      const p = taxParent(cur);
      cur = p != null ? byId.get(p) : undefined;
    }
    // path[0] is the direct child of root = the "subcategory"
    if (path.length) taxToLevel2.set(taxId(t), path[0]);
  }

  // create categories parent-before-child (sorted by depth)
  const depthOf = (n: TaxNode): number => {
    let d = 0, p = taxParent(n);
    while (p != null && byId.has(p)) { d++; p = taxParent(byId.get(p)!); }
    return d;
  };
  const ordered = [...subtree].sort((a, b) => depthOf(a) - depthOf(b));

  let catCount = 0;
  for (const t of ordered) {
    const id = taxId(t);
    const name = taxName(t);
    const isRoot = id === rootId;
    const parentTaxId = isRoot ? null : taxParent(t);
    const parentCatId = parentTaxId != null ? taxToCategoryId.get(parentTaxId) : null;

    let slug = slugify(name) || `cat-${id}`;
    if (usedSlugs.has(slug)) slug = `${slug}-${id}`;
    usedSlugs.add(slug);

    if (DRY_RUN) {
      taxToCategoryId.set(id, `dry-${id}`);
      catCount++;
      continue;
    }

    const cat = await prisma.category.upsert({
      where: { slug },
      update: { name, parentId: parentCatId ?? null, isActive: true },
      create: {
        name,
        slug,
        parentId: parentCatId ?? null,
        isActive: true,
        sortOrder: Number(pick(t, ["sort", "order"])) || 0,
      },
    });
    taxToCategoryId.set(id, cat.id);
    catCount++;
  }
  log(`  ${DRY_RUN ? "would create" : "created/updated"} ${catCount} categories\n`);

  // 3. products (with prices)
  log("③ Fetching products in branch…");
  const products = await fetchAllPages<BigBuyProduct>("products", (page) =>
    client.getProducts({ parentTaxonomy: rootId, page, pageSize: PAGE_SIZE })
  );
  const working = products.slice(0, Number.isFinite(LIMIT) ? LIMIT : undefined);
  log(`  ${products.length} products fetched${working.length !== products.length ? ` (limited to ${working.length})` : ""}\n`);

  // 4. supporting data (best-effort)
  log("④ Fetching names/descriptions, images, categories, stock, brands…");
  const info = await fetchAllPages<Record<string, unknown>>("info", (page) =>
    client.getProductsInformation({ isoCode: ISO, parentTaxonomy: rootId, page, pageSize: PAGE_SIZE })
  );
  const images = await fetchAllPages<Record<string, unknown>>("images", (page) =>
    client.getProductsImages({ parentTaxonomy: rootId, page, pageSize: PAGE_SIZE })
  );
  const prodCats = await fetchAllPages<Record<string, unknown>>("product-categories", (page) =>
    client.getProductsCategories({ parentTaxonomy: rootId, page, pageSize: PAGE_SIZE })
  );
  let stock: Record<string, unknown>[] = [];
  try {
    stock = await fetchAllPages<Record<string, unknown>>("stock", (page) =>
      client.getProductsStock({ parentTaxonomy: rootId, page, pageSize: PAGE_SIZE })
    );
  } catch { /* optional */ }
  let manufacturers: Record<string, unknown>[] = [];
  try {
    manufacturers = await client.get<Record<string, unknown>[]>("/rest/catalog/manufacturers.json", { isoCode: ISO });
  } catch { /* optional */ }

  // build lookup maps (keyed by product id)
  const infoById = new Map<number, Record<string, unknown>>();
  for (const r of info) {
    const id = num(pick(r, ["id", "sku", "product", "productId"]));
    if (id != null) infoById.set(id, r);
  }
  const imagesById = new Map<number, string[]>();
  for (const r of images) {
    const id = num(pick(r, ["id", "product", "productId", "sku"]));
    if (id == null) continue;
    const imgs = pick<unknown[]>(r, ["images", "url", "urls"]);
    const urls: string[] = [];
    if (Array.isArray(imgs)) {
      for (const im of imgs) {
        const u = typeof im === "string" ? im : pick<string>(im as Record<string, unknown>, ["url", "imageUrl", "src"]);
        if (u) urls.push(u);
      }
    }
    if (urls.length) imagesById.set(id, urls);
  }
  const catsById = new Map<number, number[]>();
  for (const r of prodCats) {
    const id = num(pick(r, ["id", "product", "productId", "sku"]));
    const cat = num(pick(r, ["category", "categoryId", "taxonomy", "taxonomyId"]));
    if (id == null || cat == null) continue;
    if (!catsById.has(id)) catsById.set(id, []);
    catsById.get(id)!.push(cat);
  }
  const stockById = new Map<number, number>();
  for (const r of stock) {
    const id = num(pick(r, ["id", "product", "productId", "sku"]));
    if (id == null) continue;
    const qtyDirect = num(pick(r, ["quantity", "stock", "available"]));
    let qty = qtyDirect;
    const stocks = pick<unknown[]>(r, ["stocks"]);
    if (qty == null && Array.isArray(stocks)) {
      qty = stocks.reduce<number>((s, x) => s + (num(pick(x as Record<string, unknown>, ["quantity", "stock"])) || 0), 0);
    }
    if (qty != null) stockById.set(id, qty);
  }
  const brandById = new Map<number, string>();
  for (const m of manufacturers) {
    const id = num(pick(m, ["id"]));
    const name = pick<string>(m, ["name", "title"]);
    if (id != null && name) brandById.set(id, String(name));
  }
  log(`  info:${infoById.size} images:${imagesById.size} prodCats:${catsById.size} stock:${stockById.size} brands:${brandById.size}\n`);

  // sample shapes for transparency
  if (working[0]) log(`  sample product keys: ${Object.keys(working[0]).join(", ")}`);
  if (info[0]) log(`  sample info keys: ${Object.keys(info[0]).join(", ")}\n`);

  // 5. upsert products
  log("⑤ Importing products…");
  let imported = 0, skippedNoPrice = 0, errors = 0;
  for (const p of working) {
    const id = num(pick(p, ["id", "productId"]));
    const sku = String(pick(p, ["sku"]) ?? id ?? "").trim();
    if (!sku || id == null) { skippedNoPrice++; continue; }

    const wholesale = num(pick(p, ["wholesalePrice", "wholesale_price", "priceWholesale", "price"]));
    if (wholesale == null || wholesale <= 0) { skippedNoPrice++; continue; }
    const retail = num(pick(p, ["retailPrice", "retail_price", "pvr"]));
    const price = round2(wholesale * MARKUP);
    const comparePrice = retail && retail > price ? round2(retail) : null;

    const inf = infoById.get(id);
    const name = String(pick(inf, ["name", "title"]) ?? `BigBuy ${sku}`).trim().slice(0, 250) || `BigBuy ${sku}`;
    const description = pick<string>(inf, ["description", "longDescription", "body"]) ?? null;
    const brand = (() => {
      const mId = num(pick(p, ["manufacturer", "manufacturerId", "brand"]));
      return mId != null ? brandById.get(mId) ?? null : null;
    })();
    const qty = stockById.get(id) ?? DEFAULT_STOCK;
    const imgs = imagesById.get(id) ?? [];

    // resolve categories: leaf(s) in our branch + their level-2 subcategory ancestor
    const taxIds = catsById.get(id) ?? [];
    const targetCatIds = new Set<string>();
    for (const tx of taxIds) {
      if (taxToCategoryId.has(tx)) {
        targetCatIds.add(taxToCategoryId.get(tx)!);
        const lvl2 = taxToLevel2.get(tx);
        if (lvl2 != null && taxToCategoryId.has(lvl2)) targetCatIds.add(taxToCategoryId.get(lvl2)!);
      }
    }
    if (targetCatIds.size === 0 && taxToCategoryId.has(rootId)) {
      targetCatIds.add(taxToCategoryId.get(rootId)!); // fall back to Electronics root
    }

    const slug = `${slugify(name)}-${slugify(sku)}`.slice(0, 200) || `bigbuy-${sku}`;

    if (DRY_RUN) {
      imported++;
      if (imported <= 5) {
        log(`  ✎ ${name} | sku ${sku} | cost €${wholesale} → €${price} | cats ${[...targetCatIds].length} | imgs ${imgs.length}`);
      }
      continue;
    }

    try {
      const product = await prisma.product.upsert({
        where: { sku },
        update: {
          name, description, price, costPrice: wholesale,
          comparePrice, quantity: qty, status: "ACTIVE",
          brand: brand ?? undefined,
          ean: String(pick(p, ["ean13", "ean"]) ?? "") || undefined,
        },
        create: {
          name, slug, sku, description,
          shortDescription: description ? String(description).replace(/<[^>]+>/g, "").slice(0, 160) : null,
          price, costPrice: wholesale, comparePrice,
          quantity: qty, trackInventory: true, status: "ACTIVE",
          condition: "new",
          brand: brand ?? null,
          ean: String(pick(p, ["ean13", "ean"]) ?? "") || null,
          weight: num(pick(p, ["weight"])) ?? null,
          metadata: { source: "bigbuy", bigbuyId: id },
        },
      });

      // categories (replace links)
      await prisma.productCategory.deleteMany({ where: { productId: product.id } });
      if (targetCatIds.size) {
        await prisma.productCategory.createMany({
          data: [...targetCatIds].map((categoryId) => ({ productId: product.id, categoryId })),
          skipDuplicates: true,
        });
      }

      // images (replace)
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      if (imgs.length) {
        await prisma.productImage.createMany({
          data: imgs.slice(0, 10).map((url, i) => ({ productId: product.id, url, alt: name, sortOrder: i })),
        });
      }

      imported++;
      if (imported % 100 === 0) log(`  …${imported} imported`);
    } catch (err) {
      errors++;
      if (errors <= 10) log(`  ✗ ${sku}: ${(err as Error).message}`);
    }
  }

  log(`\n✓ Done. ${DRY_RUN ? "would import" : "imported"} ${imported} products` +
      ` (skipped ${skippedNoPrice} without price, ${errors} errors).`);
  log(`  Categories: ${catCount}. They are ACTIVE and will appear in /catalog.\n`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect().catch(() => {}); });
