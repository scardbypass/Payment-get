# Provider setup

Payment-Get now stores provider account configuration per `PaymentAccount`. Sensitive provider configuration is encrypted before being written to `secretRef`; the API never returns the decrypted secret.

## 1. Bank Jago

Use an authorized Jago account and a dedicated Gmail mailbox that receives the Jago transaction notifications.

Required in **Admin → Provider → + Tambah**:

- Provider: `Bank Jago`
- Owner: `ADMIN` for shared routing, or `USER` for a personal account
- Type: `SHARED` or `PERSONAL`
- Gmail notifikasi
- Gmail **App Password** (not the Gmail account password)
- Language: `id` or `en`
- Optional webhook secret if you also expose a provider callback

The worker checks the mailbox over IMAP TLS and matches the notification amount against the payment's `payableAmount`.

## 2. blu by BCA Digital

Required:

- Provider: `blu`
- Dedicated Gmail mailbox receiving blu transaction receipts
- Gmail App Password
- Shared/personal owner and routing priority

The worker reads receipt mail over IMAP TLS and matches the detected amount to the payment amount.

## 3. BCA / KlikBCA

Payment-Get is intentionally separated from the browser automation layer. If you operate the existing KlikBCA mutation service, configure:

- Provider: `bca`
- Mutation API URL, for example your own `/api` service
- Mutation API bearer key
- Shared/personal owner and routing priority

The Payment-Get worker calls `GET /mutation` with `created_from`, `created_to`, `amount_eq`, and `direction=credit` and settles only an exact amount match.

Do not put raw BCA credentials in frontend JavaScript, `.env` committed to Git, or README files.

## 4. GoPay

The default integration path is signed webhook ingestion. Configure:

- Provider: `gopay`
- `Webhook-only` enabled
- A strong webhook secret (minimum 16 characters)

Use an authorized merchant/provider integration for production API access. Do not reverse-engineer private app endpoints or bypass authentication/anti-abuse controls.

## 5. Livin' Merchant

The default integration path is also signed webhook ingestion. Configure:

- Provider: `livin_merchant`
- `Webhook-only` enabled
- Strong webhook secret

For production merchant/API access, use Bank Mandiri's official merchant/API onboarding and credentials applicable to your account.

## Account routing

Each account has:

- `owner`: `ADMIN` or `USER`
- `type`: `SHARED` or `PERSONAL`
- `status`: `ACTIVE`, `INACTIVE`, or `MAINTENANCE`
- `priority`: lower value wins
- `weight`: available for future weighted routing

When a user creates a payment, Payment-Get first tries an active personal account when the user has `personalEnabled=true`. Otherwise it falls back to an active admin shared account.

## Recommended setup

For a first production deployment:

1. Create one dedicated Jago Gmail mailbox and one dedicated blu Gmail mailbox.
2. Enable Gmail 2-step verification and generate an App Password for each mailbox.
3. Add the accounts as `ADMIN + SHARED`.
4. Configure BCA through your own authenticated mutation service.
5. Configure GoPay/Livin Merchant as webhook-only until an authorized production API integration is available.
6. Set `priority=10` for the preferred account and `priority=20` for the fallback account.
7. Keep provider secrets out of Git and rotate them periodically.
8. Test with a small payment before enabling a high-volume account.

## Webhook flow

```text
Provider callback
      ↓
/webhooks/{provider}/{accountId}
      ↓
HMAC/signature verification
      ↓
Normalize provider event
      ↓
Find pending payment by account + payable amount
      ↓
Atomic settlement
      ↓
Wallet ledger
      ↓
payment.success webhook
```

## Security

- Never store bank/Gmail passwords in source code.
- Prefer Gmail App Passwords for mailbox polling.
- Never expose `secretRef` through an admin response.
- Rotate webhook secrets when staff or infrastructure changes.
- Keep provider accounts owned by the correct admin/user.
- Use `MAINTENANCE` instead of deleting an account that has transaction history.
