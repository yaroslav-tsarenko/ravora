import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// pg-connection-string v3 / pg v9 will drop the legacy aliasing of
// sslmode=prefer|require|verify-ca to verify-full and emit a security warning
// until an explicit mode is set. We already rely on the verify-full behaviour
// (Neon serves valid public certs), so pin it explicitly to silence the warning.
function normalizeSslMode(url: string): string {
  return url.replace(
    /([?&]sslmode=)(prefer|require|verify-ca)(?=&|$)/i,
    "$1verify-full",
  );
}

const connectionString = normalizeSslMode(
  process.env.DIRECT_URL ||
    "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable",
);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
