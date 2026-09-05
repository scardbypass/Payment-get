# WhatsApp Bot Adapter

Connect the bot to the REST API using an authorized WhatsApp provider/session.

Commands:
- `daftar` → nama, username, Gmail, nomor HP, password
- `login` → username/Gmail + password
- `saldo` → GET /api/v1/balance
- `mutasi` → GET /api/v1/transactions
- `transaksi PAY-XXXX` → GET /api/v1/payments/{id}
- `wd 500000` → POST /api/v1/withdrawals
- `statuswd` → GET /api/v1/withdrawals

Keep provider sessions and API tokens server-side. Never request bank/Gmail credentials through WhatsApp.
