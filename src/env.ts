import 'dotenv/config'; import { z } from 'zod';
export const env=z.object({DATABASE_URL:z.string().min(1),JWT_SECRET:z.string().min(16),APP_URL:z.string().url(),BOT_TOKEN:z.string().optional()}).parse(process.env);
