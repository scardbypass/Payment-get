import { decrypt } from '../services/security.js';
import { z } from 'zod';

const gmail = {
  gmailEmail: z.string().email(),
  gmailAppPassword: z.string().min(8),
};

export const providerConfig = z.discriminatedUnion('provider', [
  z.object({ provider: z.literal('jago'), ...gmail, language: z.enum(['id', 'en']).default('id'), label: z.string().max(191).optional() }),
  z.object({ provider: z.literal('blu'), ...gmail, label: z.string().max(191).optional() }),
  z.object({ provider: z.literal('bca'), ...gmail, mutationApiUrl: z.string().url(), apiKey: z.string().min(8), label: z.string().max(191).optional() }),
  z.object({ provider: z.literal('gopay'), ...gmail, webhookOnly: z.boolean().default(true), label: z.string().max(191).optional() }),
  z.object({ provider: z.literal('livin_merchant'), ...gmail, webhookOnly: z.boolean().default(true), label: z.string().max(191).optional() })
]);

export type ProviderConfig = z.infer<typeof providerConfig>;

export function readProviderConfig(secretRef: string | null | undefined): ProviderConfig | null {
  if (!secretRef) return null;
  try {
    return providerConfig.parse(JSON.parse(decrypt(secretRef)));
  } catch {
    return null;
  }
}

export function hasGmailMonitoring(config: ProviderConfig | null): boolean {
  return Boolean(config?.gmailEmail && config?.gmailAppPassword);
}
