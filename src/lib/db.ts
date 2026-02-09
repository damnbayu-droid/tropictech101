import { PrismaClient } from '@prisma/client'

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ DATABASE_URL is not set. Prisma might fail during build if static pages are being generated.');
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
    ...(dbUrl ? { datasources: { db: { url: dbUrl } } } : {})
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db