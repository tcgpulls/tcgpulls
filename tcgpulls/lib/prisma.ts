import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const databaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL_UNPOOLED
    : process.env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: `${databaseUrl}`,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
