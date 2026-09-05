import { PrismaClient } from '@prisma/client';
export const db = new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['error','warn'] : ['error'] });
process.on('SIGINT', async () => { await db.$disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await db.$disconnect(); process.exit(0); });
