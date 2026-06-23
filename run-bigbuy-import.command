#!/bin/bash
# Double-click this file (or run it) to load ALL BigBuy electronics into the
# new Neon database. Pulls from BigBuy, applies +10% markup, publishes products.
#
# It must run on your Mac (this machine can reach both BigBuy and Neon).
# Your BigBuy API key is read from the project's .env file.

set -e
cd "$(dirname "$0")"

# Target database (the new Neon DB you provided).
POOLER_URL="postgresql://neondb_owner:npg_YPM5B8eiwNdq@ep-wandering-butterfly-adb5xn66-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
# Direct (non-pooled) URL for schema creation — Neon prefers this for DDL.
DIRECT_DB_URL="postgresql://neondb_owner:npg_YPM5B8eiwNdq@ep-wandering-butterfly-adb5xn66.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

echo "▶ Step 1/3 — generating Prisma client…"
npx prisma generate >/dev/null

echo "▶ Step 2/3 — creating tables on the new database…"
DATABASE_URL="$DIRECT_DB_URL" npx prisma db push --url "$DIRECT_DB_URL" --accept-data-loss

echo "▶ Step 3/3 — importing all electronics from BigBuy (+10% markup)…"
echo "  (this can take a while and may pause for BigBuy rate limits — leave it running)"
npx tsx scripts/import-bigbuy.ts --database-url "$POOLER_URL"

echo ""
echo "✅ Done. The new database is populated with BigBuy electronics."
echo "Press any key to close."
read -n 1 -s
