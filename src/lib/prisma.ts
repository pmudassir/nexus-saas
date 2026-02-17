import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;

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
