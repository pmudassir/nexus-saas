import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function withSecureSslMode(rawConnectionString: string): string {
  try {
    const url = new URL(rawConnectionString);
    const isPostgres =
      url.protocol === "postgres:" || url.protocol === "postgresql:";
    const isLocalhost =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";

    if (isPostgres && !isLocalhost) {
      const sslMode = url.searchParams.get("sslmode");
      const normalized = sslMode?.toLowerCase();
      const aliasModes = new Set(["prefer", "require", "verify-ca"]);

      if (!normalized || aliasModes.has(normalized)) {
        url.searchParams.set("sslmode", "verify-full");
        return url.toString();
      }
    }

    return rawConnectionString;
  } catch {
    return rawConnectionString;
  }
}

const connectionString = withSecureSslMode(process.env.DATABASE_URL!);

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prismaLogLevels: Prisma.LogLevel[] =
  process.env.PRISMA_LOG_QUERIES === "true"
    ? ["query", "warn", "error"]
    : process.env.NODE_ENV === "development"
      ? ["warn", "error"]
      : ["error"];

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: prismaLogLevels,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
