import { decrypt } from '../services/security.js';
import { z } from 'zod';

const base = z.object({ label: z.string().max(191).optional() });
export const providerConfig = z.discriminatedUnion('provider', [
  z.object({ provider: z.literal('jago'), gmailEmail: z.string().email(), gmailAppPassword: z.string().min(8), language: z.enum(['id', 'en']).default('id') }),
  z.object({ provider: z.literal('blu'), gmailEmail: z.string().email(), gmailAppPassword: z.string().min(8) }),
  z.object({ provider: z.literal('bca'), mutationApiUrl: z.string().url(), apiKey: z.string().min(8) }),
  z.object({ provider: z.literal('gopay'), webhookOnly: z.boolean().default(true) }),
  z.object({ provider: z.literal('livin_merchant'), webhookOnly: z.boolean().default(true) })
]).and(base);

export type ProviderConfig = z.infer<typeof providerConfig>;

export function readProviderConfig(secretRef: string | null | undefined): ProviderConfig | null {
  if (!secretRef) return null;
  try {
    return providerConfig.parse(JSON.parse(decrypt(secretRef)));
  } catch {
    return null;
  }
}
