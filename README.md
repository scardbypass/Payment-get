# Payment-Get

Payment-Get adalah fondasi SaaS payment gateway multi-tenant yang siap dideploy setelah konfigurasi provider pembayaran yang sah. UI, REST API, wallet/ledger, API key, webhook signing, subscription, multi-account routing dasar, withdrawal workflow, dan bot WhatsApp sudah disiapkan.

## Fitur
- Register: nama, username, Gmail, nomor HP, password.
- Login menggunakan username atau Gmail.
- Dashboard web modern dan responsive.
- Subscription plan default Rp90.000/bulan; aktivasi subscription dilakukan admin/provider billing.
- Admin dapat membuat banyak payment account (Jago/BCA/GoPay/QRIS/provider lain) dan mengatur priority/weight/status.
- Personal account per user dan shared account milik admin.
- Payment dengan unique code 0–999 dan idempotency key.
- Atomic wallet balance + pending + ledger untuk withdrawal.
- Signed webhook `X-Payment-Get-Signature`.
- API key `pg_live_*` untuk Open API.
- Audit-ready data model dan webhook delivery log.
- WhatsApp bot dengan QR login, register/login, saldo, transaksi, dan logout. Session token disimpan terenkripsi di database.
- Docker + MariaDB + CI.

## API
- `POST /auth/register`
- `POST /auth/login`
- `GET /api/v1/me`
- `GET /api/v1/balance`
- `POST /api/v1/payments`
- `GET /api/v1/payments/:id`
- `POST /api/v1/withdrawal-accounts`
- `POST /api/v1/withdrawals`
- `GET /api/v1/transactions`
- `POST /api/v1/api-keys`
- `PATCH /api/v1/webhook`
- Open API dengan API key: `/open/v1/*`
- Admin: `/admin/*`

## Deployment
1. Copy `.env.example` menjadi `.env` dan isi secret yang kuat.
2. Jangan commit `.env`, password bank/Gmail, token WhatsApp, API key, atau secret provider.
3. `npm install`
4. `npx prisma generate`
5. `npx prisma migrate deploy`
6. `npm run build && npm start`

### Docker
Set `DB_PASSWORD`, `DB_ROOT_PASSWORD`, `JWT_SECRET`, `ENCRYPTION_KEY`, `APP_URL`, dan `CORS_ORIGINS`, lalu jalankan `docker compose up -d --build`.

## Provider pembayaran
Payment-Get sengaja tidak meng-hardcode credential atau endpoint bank yang tidak terdokumentasi. Adapter provider harus menggunakan akun yang dimiliki/diizinkan oleh operator dan API/notification channel resmi atau service internal yang memang diotorisasi. Untuk Jago/Blu berbasis email notification, BCA melalui service KlikBCA milik operator, dan GoPay/QRIS melalui provider resmi, buat adapter di `src/providers/` dan arahkan hasil mutasi ke `settlePayment()`.

## WhatsApp
Jalankan `npm run dev:bot` untuk development atau `npm run build && npm run start:bot` untuk production. Scan QR yang muncul di terminal menggunakan WhatsApp milik operator. Bot tidak mengirim broadcast massal dan hanya menjalankan command transaksi yang diautentikasi.

## Catatan produksi
Codebase ini sudah diperkeras untuk deployment, tetapi **status payment tetap tidak boleh dianggap otomatis sukses hanya karena endpoint tersedia**. Integrasi mutasi Jago/Blu/BCA/GoPay/QRIS harus dikonfigurasi dengan credential dan kontrak API/notification yang benar. Jangan menaruh credential provider di source code.
