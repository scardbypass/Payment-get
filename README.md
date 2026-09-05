# Payment-Get

Standalone multi-tenant payment gateway foundation.

- Register: name, username, Gmail/email, phone, password.
- Login: username or Gmail/email + password.
- Shared admin payment accounts and optional personal accounts.
- Per-user transaction fee and withdrawal fee overrides.
- 3-digit unique-code reservation 000-999 per active payment account and amount.
- Automatic payment expiry and stale cleanup.
- Wallet + ledger models and withdrawal requests.
- Admin user pricing/account/withdrawal controls.
- REST API + OpenAPI specification.
- WhatsApp command contract in `src/bot/README.md`.

Defaults: shared account fee 0.70%, withdrawal Rp10,000. Personal/Premium can be enabled by admin and configured per user.

Provider credentials must stay in environment/secret storage. The previous GoPay implementation is not copied here because its source contains commercial/licensing restrictions; use an authorized provider adapter.
