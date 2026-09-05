<div align="center">

# 💳 Payment-Get

### Modern Payment Gateway Infrastructure

<p>
  <strong>API First • Multi-Tenant • Multi Provider • Wallet • Webhook • WhatsApp</strong>
</p>

<p>
  <a href="https://github.com/scardbypass/Payment-get">
    <img src="https://img.shields.io/badge/Payment--Get-2026-7c3aed?style=for-the-badge&logo=stripe&logoColor=white">
  </a>
  <img src="https://img.shields.io/badge/Node.js-22%2B-339933?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white">
  <img src="https://img.shields.io/badge/MariaDB-Ready-003545?style=for-the-badge&logo=mariadb&logoColor=white">
</p>

<p>
  Payment infrastructure modern untuk merchant, reseller,
  developer dan bisnis digital.
</p>

<br>

<a href="#-fitur-utama">
  <img src="https://img.shields.io/badge/EXPLORE_FEATURES-7c3aed?style=for-the-badge">
</a>

<a href="#-installation">
  <img src="https://img.shields.io/badge/INSTALL_NOW-2563eb?style=for-the-badge">
</a>

</div>

---

<div align="center">

## ✨ Payment-Get

**One platform. One API. Multiple payment channels.**

</div>

<table>
<tr>
<td align="center" width="25%">

### 💰
**Payment**

Invoice & payment  
Unique code  
Expiry  
Status tracking

</td>

<td align="center" width="25%">

### 🏦
**Providers**

Jago  
blu  
BCA  
GoPay  
Livin' Merchant

</td>

<td align="center" width="25%">

### 🔔
**Webhook**

HMAC  
Events  
Retry  
Delivery log

</td>

<td align="center" width="25%">

### 🤖
**WhatsApp**

QR Login  
Saldo  
Transaksi  
Payment

</td>
</tr>
</table>

---

# 🌌 Design Philosophy

Payment-Get tidak dibuat seperti panel pembayaran lama.

Konsep UI:

```text
┌──────────────────────────────────────────┐
│                                          │
│             PAYMENT-GET                  │
│                                          │
│       Modern Payment Infrastructure      │
│                                          │
│    ✦ Glassmorphism                       │
│    ✦ iOS Inspired                        │
│    ✦ Frosted Glass                       │
│    ✦ Soft Gradient                       │
│    ✦ Mobile First                        │
│                                          │
└──────────────────────────────────────────┘

UI Principles

🍎 iOS-inspired interface

🧊 Frosted glass

🌈 Soft gradient

✨ Glossy cards

🌑 Dark mode

📱 Mobile first

🖥️ Desktop responsive

🎞️ Smooth micro animation

🧭 Simple navigation



---

🚀 Fitur Utama

👤 User System

Register menggunakan:

Nama
Username
Gmail
Nomor HP
Password

Login:

Username
atau
Gmail
+
Password


---

💳 Payment Engine

Payment:

Amount
Reference
Unique Code
Payable Amount
Expiration
Status
Provider

Contoh:

Amount
Rp 150.000

Unique Code
327

Payable
Rp 150.327

Reference
ORDER-1042

Status:

PENDING
   │
   ▼
DETECTED
   │
   ▼
SUCCESS

Alternative:

EXPIRED
CANCELLED
LATE_REVIEW


---

🔐 Idempotency

Payment request menggunakan:

Idempotency-Key

Contoh:

POST /api/v1/payments
Authorization: Bearer <JWT>
Idempotency-Key: ORDER-1042
Content-Type: application/json

Request:

{
  "amount": 150000,
  "reference": "ORDER-1042"
}

Jika request dikirim ulang:

Request #1 ─┐
Request #2 ─┼──► Same Idempotency Key
Request #3 ─┘
                 │
                 ▼
          One Payment

Tujuannya mencegah duplicate payment.


---

🏦 Multi Provider

Payment-Get menggunakan provider adapter architecture.

PAYMENT-GET
                         │
                 ┌───────┴────────┐
                 │ Provider Layer │
                 └───────┬────────┘
                         │
       ┌─────────┬───────┼───────┬──────────┐
       ▼         ▼       ▼       ▼          ▼
     Jago       blu     BCA     GoPay      Livin'

Provider:

Provider	Status

🟢 Bank Jago	Adapter Boundary
🔵 blu	Adapter Boundary
🔷 BCA	Adapter Boundary
🟢 GoPay	Adapter Boundary
🟡 Livin' Merchant	Adapter Boundary
🟣 QRIS	Provider Ready


> Adapter boundary tidak berarti koneksi production otomatis aktif. Credential, API, webhook, dan notification mechanism resmi provider tetap diperlukan.




---

🟡 Livin' Merchant

Payment-Get memiliki adapter:

src/providers/livin-merchant.ts

Flow:

Livin' Merchant
       │
       ▼
Official Notification/API
       │
       ▼
Signature Verification
       │
       ▼
Normalize Transaction
       │
       ▼
Payment Matching
       │
       ▼
Settlement

Data normalized:

{
  "transactionId": "TX-123",
  "amount": 150327,
  "status": "SUCCESS",
  "outlet": "MERCHANT",
  "transactionTime": "2026-09-05T10:00:00Z"
}

Payment-Get tidak melakukan:

❌ OTP bypass
❌ Login bypass
❌ Credential harvesting
❌ Unauthorized session access
❌ Reverse engineering untuk melewati proteksi

Integrasi production harus menggunakan API / webhook / notification channel yang memang diizinkan.


---

🔔 Webhook

Endpoint:

POST /webhooks/:provider/:accountId

Contoh:

POST /webhooks/jago/1
POST /webhooks/blu/2
POST /webhooks/bca/3
POST /webhooks/gopay/4
POST /webhooks/livin_merchant/5

Signature:

X-Payment-Get-Signature

Flow:

Provider
                 │
                 ▼
              Webhook
                 │
                 ▼
        Verify Signature
                 │
        ┌────────┴────────┐
        │                 │
     INVALID             VALID
        │                 │
        ▼                 ▼
      REJECT         Normalize TX
                          │
                          ▼
                    Match Payment
                          │
                          ▼
                      Settlement


---

💰 Settlement Engine

Settlement merupakan bagian paling penting.

Transaction
     │
     ▼
Signature Valid?
     │
     ▼
Provider Active?
     │
     ▼
Payment Found?
     │
     ▼
Amount Match?
     │
     ▼
Already Settled?
     │
     ▼
Atomic Settlement
     │
     ├───────────────┐
     ▼               ▼
 Wallet Credit    Ledger Entry
     │
     ▼
Webhook Merchant

Payment tidak dianggap SUCCESS hanya karena:

❌ Request berhasil
❌ Provider tersedia
❌ Nominal mirip

Harus ada pencocokan payment yang valid.


---

👛 Wallet

Wallet memiliki:

Balance
Pending
Ledger

Contoh:

┌─────────────────────────────┐
│       AVAILABLE BALANCE     │
│                             │
│        Rp 1.250.000         │
│                             │
│ Pending       Rp 150.000    │
└─────────────────────────────┘

Ledger:

CREDIT
DEBIT
PAYMENT
PAYMENT_FEE
WITHDRAWAL
WITHDRAWAL_FEE
REFUND
ADJUSTMENT


---

💸 Withdrawal

Flow:

User
 │
 ▼
Create Withdrawal
 │
 ▼
Balance Check
 │
 ▼
Atomic Reserve
 │
 ▼
PENDING
 │
 ▼
Admin Review
 │
 ├───────────────┐
 ▼               ▼
PAID          REJECTED
 │               │
 ▼               ▼
Debit          Refund
Ledger         Ledger

Jika reject:

Amount
+
Fee
↓
Refund
↓
Wallet


---

👨‍💻 Admin Control Center

Admin dashboard:

┌─────────────────────────────────────────┐
│             ADMIN DASHBOARD              │
├─────────────────────────────────────────┤
│                                         │
│  Users       Payments       Success     │
│  1,240       18,420         17,921      │
│                                         │
│  Pending     Withdrawals    Providers   │
│  120         31             14          │
│                                         │
└─────────────────────────────────────────┘

Menu:

Dashboard
Users
Subscriptions
Payment Accounts
Providers
Payments
Transactions
Withdrawals
API Keys
Webhooks
Audit Log
Settings


---

🏦 Payment Account Manager

Admin dapat memiliki banyak account.

Contoh:

Jago #01
Jago #02
Jago #03
Jago #04
Jago #05
Jago #06
Jago #07
Jago #08
Jago #09
Jago #10

Setiap account:

Provider
Owner
Account Type
Account Label
Status
Priority
Weight
Secret
Webhook Secret

Status:

ACTIVE
INACTIVE
MAINTENANCE


---

⚖️ Routing

Contoh:

Jago #1
Priority: 1
Weight: 5

Jago #2
Priority: 1
Weight: 3

Jago #3
Priority: 2
Weight: 2

Routing dapat dikembangkan menjadi:

Priority Routing
Weighted Routing
Failover Routing
Provider Health Routing


---

👥 Multi Tenant

Payment-Get mendukung:

ADMIN
USER

Account:

SHARED
PERSONAL

Contoh:

ADMIN
 │
 ├── Jago
 ├── BCA
 └── GoPay
       │
       ▼
    SHARED

User:

USER
 │
 ├── Jago Personal
 └── Livin Personal
       │
       ▼
    PERSONAL


---

💵 Subscription

Default:

PRO
Rp90.000 / bulan

Subscription:

Plan
Price
Start Date
End Date
Status

Status:

ACTIVE
EXPIRED
CANCELLED


---

🔑 Open API

API key:

pg_live_xxxxxxxxxxxxxxxxx

Contoh:

Authorization: Bearer pg_live_xxxxxxxxx

Endpoint:

/open/v1/*

Payment:

POST /open/v1/payments


---

📱 WhatsApp Bot

Payment-Get mempunyai WhatsApp Bot.

Technology:

Baileys

Commands:

/help
/register
/login
/saldo
/transaksi
/logout

Flow:

WhatsApp
    │
    ▼
QR Authentication
    │
    ▼
Bot Session
    │
    ▼
Payment-Get API
    │
    ▼
Database

Bot tidak menyimpan credential provider di chat.


---

🎨 CSS Design System

Gunakan design token agar seluruh UI konsisten.

:root {
  --bg: #07070b;

  --surface:
    rgba(255, 255, 255, 0.08);

  --surface-hover:
    rgba(255, 255, 255, 0.12);

  --border:
    rgba(255, 255, 255, 0.12);

  --text:
    #f8fafc;

  --muted:
    #a1a1aa;

  --primary:
    #7c3aed;

  --secondary:
    #2563eb;

  --success:
    #22c55e;

  --danger:
    #fb7185;

  --radius-sm: 14px;
  --radius-md: 20px;
  --radius-lg: 28px;

  --blur:
    28px;

  --shadow:
    0 30px 90px rgba(0,0,0,.45);
}


---

🧊 Glass Component

.glass {
  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.12),
      rgba(255,255,255,.04)
    );

  border:
    1px solid
    rgba(255,255,255,.13);

  backdrop-filter:
    blur(28px)
    saturate(150%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(150%);

  box-shadow:
    0 30px 90px
    rgba(0,0,0,.35);

  border-radius:
    28px;
}


---

✨ Glossy Button

.btn-primary {
  border: 1px solid
    rgba(255,255,255,.25);

  border-radius: 16px;

  padding: 13px 20px;

  color: white;

  font-weight: 700;

  background:
    linear-gradient(
      135deg,
      #7c3aed,
      #2563eb
    );

  box-shadow:
    0 14px 35px
    rgba(79,70,229,.30);

  transition:
    transform .2s ease,
    box-shadow .2s ease,
    filter .2s ease;
}

.btn-primary:hover {
  transform:
    translateY(-2px);

  filter:
    brightness(1.08);

  box-shadow:
    0 18px 45px
    rgba(79,70,229,.40);
}


---

📱 Mobile Bottom Navigation

.bottom-nav {
  position: fixed;

  left: 12px;
  right: 12px;

  bottom:
    calc(
      12px +
      env(safe-area-inset-bottom)
    );

  display: flex;

  padding: 9px;

  border-radius: 26px;

  background:
    rgba(20,20,28,.72);

  border:
    1px solid
    rgba(255,255,255,.12);

  backdrop-filter:
    blur(28px)
    saturate(150%);

  -webkit-backdrop-filter:
    blur(28px)
    saturate(150%);

  box-shadow:
    0 20px 60px
    rgba(0,0,0,.40);

  z-index: 999;
}


---

🎞️ Animation

Animation harus ringan.

@keyframes float {

  0% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-5px);
  }

  100% {
    transform:
      translateY(0);
  }

}

.float {
  animation:
    float 4s
    ease-in-out
    infinite;
}

Untuk accessibility:

@media (
  prefers-reduced-motion: reduce
) {

  *,
  *::before,
  *::after {

    animation-duration:
      .01ms !important;

    animation-iteration-count:
      1 !important;

    scroll-behavior:
      auto !important;

    transition-duration:
      .01ms !important;
  }
}


---

📐 UI Spacing

Gunakan sistem:

8px
12px
16px
20px
24px
32px
48px
64px

Radius:

14px
18px
22px
28px
32px

Touch target:

Minimum ±44px


---

🧱 Project Architecture

Payment-get/
│
├── public/
│   └── index.html
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── src/
│   │
│   ├── auth.ts
│   ├── db.ts
│   ├── env.ts
│   ├── server.ts
│   │
│   ├── bot/
│   │   └── index.ts
│   │
│   ├── providers/
│   │   └── livin-merchant.ts
│   │
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   ├── admin.ts
│   │   ├── webhooks.ts
│   │   └── openapi.ts
│   │
│   └── services/
│       ├── api-key.ts
│       ├── payment.ts
│       ├── security.ts
│       ├── settlement.ts
│       ├── webhook.ts
│       └── unique-code.ts
│
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── openapi.yaml
├── package.json
└── README.md


---

🧰 Tech Stack

Backend

Node.js 22+
TypeScript
Express
Prisma
MariaDB
JWT
Zod
Pino
Helmet
CORS
Rate Limit

Frontend

HTML
CSS
JavaScript
Glassmorphism
Responsive UI
Mobile First

Bot

Baileys
QRCode Terminal

Infrastructure

Docker
Docker Compose
GitHub Actions
VPS
Cloudflare / Reverse Proxy


---

📦 Installation

Requirements

Node.js 22+
npm
MariaDB / MySQL
Git
Docker (optional)


---

1. Clone

git clone https://github.com/scardbypass/Payment-get.git

cd Payment-get


---

2. Install

npm install


---

3. Environment

cp .env.example .env

Edit:

nano .env

Contoh:

NODE_ENV=production

PORT=3000

DATABASE_URL="mysql://paymentget:password@127.0.0.1:3306/payment_get"

JWT_SECRET="CHANGE_ME"

ENCRYPTION_KEY="CHANGE_ME"

APP_URL="https://payment.example.com"

CORS_ORIGINS="https://payment.example.com"


---

🔐 Generate Secret

Gunakan:

openssl rand -hex 32

atau:

openssl rand -hex 64

Jangan menggunakan secret contoh pada production.


---

🗄️ Database

Generate Prisma:

npx prisma generate

Migration:

npx prisma migrate deploy


---

▶️ Development

Backend:

npm run dev

Bot:

npm run dev:bot


---

🏗️ Production

Build:

npm run build

Start:

npm start

Bot:

npm run start:bot


---

🐳 Docker

Build:

docker compose build

Start:

docker compose up -d

Logs:

docker compose logs -f

Stop:

docker compose down


---

🩺 Health Check

GET /health

GET /ready

Cocok digunakan dengan:

Uptime Kuma
Docker
Load Balancer
Monitoring


---

🔄 Deployment Architecture

INTERNET
                        │
                        ▼
                    CLOUDFLARE
                        │
                        ▼
                 NGINX / CADDY
                        │
                        ▼
                  PAYMENT-GET
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
           Node.js              MariaDB
              │
       ┌──────┴───────┐
       ▼              ▼
   Payment API    WhatsApp Bot


---

🔐 Security Checklist

Sebelum production:

[ ] HTTPS aktif
[ ] JWT_SECRET random
[ ] ENCRYPTION_KEY random
[ ] Database password kuat
[ ] .env tidak di-commit
[ ] Provider credential encrypted
[ ] Webhook signature aktif
[ ] Rate limit aktif
[ ] CORS dibatasi
[ ] Firewall aktif
[ ] Database backup
[ ] Log tidak berisi secret
[ ] API key tidak disimpan plaintext
[ ] Idempotency aktif
[ ] Withdrawal atomic
[ ] Settlement atomic


---

🧪 Development Commands

Install:

npm install

Prisma:

npx prisma generate

Migration:

npx prisma migrate deploy

Development:

npm run dev

Bot:

npm run dev:bot

Lint:

npm run lint

Build:

npm run build

Production:

npm start


---

🧭 System Flow

CUSTOMER
                    │
                    ▼
             CREATE PAYMENT
                    │
                    ▼
             PAYMENT-GET API
                    │
                    ▼
              ACCOUNT ROUTER
                    │
       ┌────────────┼─────────────┐
       ▼            ▼             ▼
     JAGO          BCA          GOPAY
       │            │             │
       └────────────┼─────────────┘
                    │
                    ▼
              TRANSACTION
                    │
                    ▼
               WEBHOOK
                    │
                    ▼
           VERIFY SIGNATURE
                    │
                    ▼
            NORMALIZE EVENT
                    │
                    ▼
             MATCH PAYMENT
                    │
                    ▼
               SETTLEMENT
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       WALLET              WEBHOOK
          │
          ▼
       LEDGER


---

🗺️ Roadmap

Core

[x] Authentication

[x] Register

[x] Login

[x] User Dashboard

[x] Wallet

[x] Payment

[x] Unique Code

[x] Idempotency

[x] Settlement

[x] Withdrawal

[x] API Key

[x] Webhook

[x] Subscription

[x] Admin


Provider

[x] Provider Architecture

[x] Jago Boundary

[x] blu Boundary

[x] BCA Boundary

[x] GoPay Boundary

[x] Livin' Merchant Boundary

[ ] Production API onboarding

[ ] Production webhook onboarding

[ ] Provider health check

[ ] Automatic failover


UI

[x] Landing Page

[x] Login

[x] Register

[x] Dashboard

[x] Glossy UI

[x] Glassmorphism

[x] Responsive

[x] Mobile Navigation

[ ] Advanced Admin UI

[ ] PWA

[ ] Push Notification

[ ] Theme Customization


WhatsApp

[x] QR Login

[x] Authentication

[x] Saldo

[x] Transaksi

[x] Logout

[ ] Payment Notification

[ ] Withdrawal Notification

[ ] Admin Command



---

⚠️ Provider Compliance

Payment-Get harus digunakan hanya dengan account dan akses yang sah.

Gunakan:

Official API
Official Webhook
Authorized Notification
Authorized Merchant Service

Jangan gunakan:

OTP bypass
Credential theft
Session theft
Login bypass
Unauthorized scraping
Protection bypass

Credential provider harus disimpan secara aman.


---

📜 License

Private project.

Provider/API masing-masing tetap tunduk pada:

Terms of Service

API agreement

Merchant agreement

Security requirements

Applicable regulations



---

<div align="center">💜 Payment-Get

Payment infrastructure for modern digital business.

PAYMENT
   +
API
   +
WEBHOOK
   +
WALLET
   +
MULTI PROVIDER
   +
WHATSAPP
   =
PAYMENT-GET

<br>Built with ❤️ for modern payment infrastructure.

</div>
