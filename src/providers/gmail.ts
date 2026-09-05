import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import type { ProviderConfig } from './config.js';

export type DetectedPayment = { providerRef: string; amount: number; date: Date };

function parseAmount(text: string): number | null {
  const match = text.replace(/\u00a0/g, ' ').match(/(?:rp|idr)?\s*([0-9]{1,3}(?:\.[0-9]{3})*(?:,[0-9]{2})?)/i);
  if (!match) return null;
  return Number.parseInt(match[1].split(',')[0].replace(/\./g, ''), 10);
}

export async function findGmailPayment(
  config: Extract<ProviderConfig, { provider: 'jago' | 'blu' }>,
  expectedAmount: number,
  start: Date,
  end: Date
): Promise<DetectedPayment | null> {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: config.gmailEmail, pass: config.gmailAppPassword },
    logger: false
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    try {
      const expectedSender = config.provider === 'jago' ? 'noreply@jago.com' : 'receipts@blubybcadigital.id';
      for await (const message of client.fetch(
        { from: 1, internalDate: { since: start, before: new Date(end.getTime() + 86_400_000) } },
        { source: true, uid: true, internalDate: true }
      )) {
        const parsed = await simpleParser(message.source);
        const senderMatches = parsed.from?.value.some((item) => item.address?.toLowerCase() === expectedSender);
        if (!senderMatches) continue;
        const when = message.internalDate ?? parsed.date;
        if (when && (when < start || when > end)) continue;
        const text = parsed.text ?? parsed.html?.replace(/<[^>]+>/g, ' ') ?? '';
        const amount = parseAmount(text);
        if (amount === expectedAmount) {
          return { providerRef: `gmail:${message.uid}`, amount, date: when ?? new Date() };
        }
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => undefined);
  }
  return null;
}
