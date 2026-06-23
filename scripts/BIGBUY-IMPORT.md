# BigBuy electronics import

Pulls **all electronics** from BigBuy into the store, organised by
category / sub-category, with a **+10% markup on the wholesale price**, and
publishes them so they appear on the site.

## Run it (from your machine — the script needs DB + internet access)

```bash
# 1. test the connection & see what would be imported (no DB writes)
npm run import:bigbuy -- --dry-run --limit 50

# 2. real import — everything
npm run import:bigbuy
```

Useful flags:

| flag | meaning |
|------|---------|
| `--dry-run` | fetch + report, write nothing to the DB |
| `--limit N` | only process the first N products (testing) |
| `--sandbox` | use `BIGBUY_API_SANDBOX` instead of production |
| `--taxonomy <id>` | force the Electronics taxonomy id (if auto-detect picks wrong) |

## What it does

1. Reads BigBuy's **taxonomy tree** and finds the *Electronics* branch
   (auto-detected by name; override with `--taxonomy`).
2. Recreates that branch as `Category` rows (parent + sub-categories), `isActive`.
3. Pulls every product in the branch and, for each one:
   - `costPrice` = BigBuy wholesale price
   - `price` = wholesale × **1.10**
   - `comparePrice` = BigBuy retail price (when higher than our price)
   - English name + description, up to 10 images, brand, stock quantity
   - links it to its sub-category **and** the top-level Electronics category
   - sets `status = ACTIVE` so it shows in `/catalog`

Re-running is safe: products upsert by `sku`, categories by `slug`.

## Important: rate limits

BigBuy throttles catalog endpoints hard (the products endpoint is ~**10
requests/hour**, taxonomies ~24/hour). The client automatically honours
`429` + `Retry-After` and backs off, so a full import can take a while and may
pause for long stretches — that's expected. Leave it running.

## Required env (already present in `.env`)

```
BIGBUY_API_PRODUCTION=...   # production token
BIGBUY_API_SANDBOX=...      # sandbox token (used with --sandbox)
DIRECT_URL=...              # Postgres connection used by the script
```

## After importing

The catalog (`/catalog`) and the category menu read live from the DB, so the
new electronics categories and products show up automatically. Empty categories
are hidden by the API until they contain products.
