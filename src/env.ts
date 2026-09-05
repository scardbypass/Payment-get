import 'dotenv/config';
import { z } from 'zod';
const schema=z.object({NODE_ENV:z.enum(['development','test','production']).default('development'),PORT:z.coerce.number().int().min(1).max(65535).default(3000),DATABASE_URL:z.string().min(1),JWT_SECRET:z.string().min(32),APP_URL:z.string().url(),CORS_ORIGINS:z.string().default(''),ENCRYPTION_KEY:z.string().min(32),WEBHOOK_TIMEOUT_MS:z.coerce.number().int().min(1000).max(30000).default(8000),SUBSCRIPTION_PRICE:z.coerce.number().int().positive().default(90000),PAYMENT_TTL_MINUTES:z.coerce.number().int().min(5).max(1440).default(30)});
export const env=schema.parse(process.env);
