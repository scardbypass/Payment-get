import { db } from '../db.js';
import { settlePayment } from '../services/settlement.js';
import { readProviderConfig } from './config.js';
import { findGmailPayment } from './gmail.js';

export async function checkPaymentAccount(
  accountId: number,
  paymentId: string,
  amount: number,
  start: Date,
  end: Date
) {
  const account = await db.paymentAccount.findUnique({ where: { id: accountId } });
  if (!account || account.status !== 'ACTIVE') return null;
  const config = readProviderConfig(account.secretRef);
  if (!config) return null;

  if (config.provider === 'jago' || config.provider === 'blu') {
    const hit = await findGmailPayment(config, amount, start, end);
    if (!hit) return null;
    return settlePayment(paymentId, hit.amount, hit.providerRef);
  }

  if (config.provider === 'bca') {
    const base = config.mutationApiUrl.endsWith('/') ? config.mutationApiUrl : `${config.mutationApiUrl}/`;
    const url = new URL('mutation', base);
    url.searchParams.set('created_from', start.toISOString());
    url.searchParams.set('created_to', end.toISOString());
    url.searchParams.set('amount_eq', String(amount));
    url.searchParams.set('direction', 'credit');
    const response = await fetch(url, { headers: { Authorization: `Bearer ${config.apiKey}` } });
    if (!response.ok) throw new Error(`BCA_MUTATION_HTTP_${response.status}`);
    const json = await response.json() as { items?: Array<{ id: string; amount: string | number; direction: string }> };
    const hit = (json.items ?? []).find((item) => Number(item.amount) === amount && item.direction === 'credit');
    if (!hit) return null;
    return settlePayment(paymentId, amount, String(hit.id));
  }

  // GoPay and Livin Merchant use signed webhook ingestion by default.
  return null;
}

export async function pollPendingPayments() {
  const payments = await db.payment.findMany({
    where: { status: 'PENDING', expiresAt: { gt: new Date() } },
    include: { account: true },
    orderBy: { createdAt: 'asc' },
    take: 100
  });

  for (const payment of payments) {
    try {
      await checkPaymentAccount(
        payment.accountId,
        payment.paymentId,
        Number(payment.payableAmount),
        new Date(payment.createdAt.getTime() - 10 * 60_000),
        new Date()
      );
    } catch {
      // Provider failures are retried on the next cycle.
    }
  }
}
