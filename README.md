# Payment-Get

Standalone multi-tenant payment gateway foundation.

- User registration/login
- Shared admin accounts + optional personal accounts
- Per-user fees
- 3-digit unique-code manager
- Wallet/ledger + withdrawals
- Admin controls
- REST API + OpenAPI
- WhatsApp bot command contract

Shared defaults: 0.70% transaction fee and Rp10,000 withdrawal fee. Personal/Premium can be enabled per user by admin.

Provider credentials must stay in secret storage. Authorized provider adapters only.
