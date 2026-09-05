import crypto from 'node:crypto';

/**
 * Safe Livin' Merchant integration boundary.
 *
 * Bank Mandiri's public Livin' Merchant pages document QRIS, transaction
 * history and notifications, but do not publish a public app-login API
 * contract. Do not reverse-engineer the mobile app or store Livin credentials
 * in source code. This adapter accepts an authorized Mandiri API/webhook
 * payload and normalizes it for Payment-Get settlement.
 */
export type LivinTransaction = {
  transactionId: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  occurredAt?: string;
  outletId?: string;
  raw?: unknown;
};

export type LivinWebhookConfig = {
  secret: string;
};

function numberValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function verifyLivinSignature(payload: string, signature: string, secret: string): boolean {
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature.trim().toLowerCase(), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Normalize an authorized Livin/Mandiri transaction notification. */
export function normalizeLivinTransaction(input: any): LivinTransaction {
  const transactionId = String(
    input?.transactionId ?? input?.transaction_id ?? input?.referenceNo ?? input?.reference_number ?? ''
  ).trim();
  const amount = numberValue(input?.amount ?? input?.transactionAmount ?? input?.transaction_amount);
  const rawStatus = String(input?.status ?? input?.transactionStatus ?? input?.transaction_status ?? '').toUpperCase();

  if (!transactionId) throw new Error('LIVIN_TRANSACTION_ID_REQUIRED');
  if (amount === null || amount <= 0) throw new Error('LIVIN_AMOUNT_INVALID');

  const status: LivinTransaction['status'] =
    ['SUCCESS', 'PAID', 'COMPLETED', 'SETTLED'].includes(rawStatus) ? 'SUCCESS' :
    ['PENDING', 'PROCESSING'].includes(rawStatus) ? 'PENDING' :
    ['REFUNDED', 'REVERSED'].includes(rawStatus) ? 'REFUNDED' : 'FAILED';

  return {
    transactionId,
    amount,
    status,
    occurredAt: input?.occurredAt ?? input?.occurred_at ?? input?.transactionDate ?? input?.transaction_date,
    outletId: input?.outletId ?? input?.outlet_id,
    raw: input,
  };
}

export const LIVIN_MERCHANT_PROVIDER = 'livin_merchant';
