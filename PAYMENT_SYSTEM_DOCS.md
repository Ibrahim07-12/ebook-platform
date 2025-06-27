# Dokumentasi Sistem Pembayaran - Platform Ebook

## Metode Pembayaran yang Didukung

Platform ebook kami mendukung berbagai metode pembayaran melalui Midtrans Payment Gateway untuk memberikan kemudahan maksimal kepada pengguna.

### 🚀 Metode Pembayaran Prioritas

#### 1. **GoPay** (Prioritas #1)
- ✅ Pembayaran instan melalui aplikasi Gojek
- ✅ Konfirmasi otomatis real-time
- ✅ Mendukung GoPay Balance dan GoPay Pay Later
- ✅ QR Code dan Deep Link

#### 2. **ShopeePay** (Prioritas #2)
- ✅ Pembayaran melalui aplikasi Shopee
- ✅ Saldo ShopeePay dan SPayLater
- ✅ Konfirmasi pembayaran instan
- ✅ Integrasi seamless

#### 3. **QRIS** (Prioritas #3)
- ✅ Universal QR Code Indonesia
- ✅ Kompatibel dengan semua e-wallet QRIS
- ✅ Support untuk Dana, OVO, LinkAja, dll
- ✅ Scan & Pay langsung

#### 4. **Mandiri Virtual Account** (Prioritas #4)
- ✅ Transfer ATM Mandiri 24/7
- ✅ Internet Banking Mandiri
- ✅ Mandiri Mobile (Livin')
- ✅ Konfirmasi otomatis real-time

### 🏦 Virtual Account Bank Lainnya

#### BCA Virtual Account
- Transfer via ATM BCA
- KlikBCA Individual/Bisnis
- BCA Mobile
- m-BCA

#### BNI Virtual Account
- ATM BNI
- BNI Internet Banking
- BNI Mobile Banking
- SMS Banking BNI

#### BRI Virtual Account
- ATM BRI
- Internet Banking BRI
- BRImo Mobile
- SMS Banking BRI

#### Permata Virtual Account
- ATM Permata
- PermataNET
- PermataBank Mobile
- SMS Banking Permata

### 🏪 Pembayaran Retail

#### Indomaret
- Bayar di kasir Indomaret
- Tunjukkan kode pembayaran
- Berlaku di seluruh Indonesia
- Jam operasional toko

#### Alfamart
- Bayar di kasir Alfamart
- Kode pembayaran unik
- Coverage nasional
- 24/7 di beberapa lokasi

### 💳 Internet Banking & Kartu

#### Internet Banking
- Mandiri ClickPay
- CIMB Clicks
- BCA KlikBCA
- BCA KlikPay
- BRI e-Pay

#### Kartu Kredit/Debit
- Visa
- Mastercard
- JCB
- American Express

## 🔧 Konfigurasi Teknis

### Environment Variables
```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxx
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# Production URLs (change when going live)
# MIDTRANS_SERVER_KEY=Mid-server-xxxxxxxxxx
# MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxx
# NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxxxxx
# MIDTRANS_IS_PRODUCTION=true
```

### API Endpoint Payment
```typescript
// POST /api/payment/create
{
  "type": "subscription|ebook",
  "item_id": 1,
  "amount": 99000,
  "plan_name": "Premium Monthly", // for subscription
  "ebook_title": "Digital Marketing Guide" // for ebook
}
```

### Enabled Payment Methods Configuration
```typescript
enabled_payments: [
  'gopay',         // GoPay - Prioritas #1
  'shopeepay',     // ShopeePay - Prioritas #2  
  'qris',          // QRIS - Prioritas #3
  'mandiri_va',    // Mandiri Virtual Account - Prioritas #4
  'bca_va',        // BCA Virtual Account
  'bni_va',        // BNI Virtual Account
  'bri_va',        // BRI Virtual Account
  'permata_va',    // Permata Virtual Account
  'alfamart',      // Alfamart
  'indomaret',     // Indomaret
  'mandiri_clickpay', // Mandiri ClickPay
  'cimb_clicks',   // CIMB Clicks
  'bca_klikbca',   // BCA KlikBCA
  'bca_klikpay',   // BCA KlikPay
  'bri_epay',      // BRI e-Pay
  'echannel'       // Mandiri E-Channel
]
```

## 🔄 Flow Pembayaran

### 1. Inisiasi Pembayaran
```
User Click Subscribe/Buy → API Payment Create → Midtrans Snap Token → Payment Page
```

### 2. Proses Pembayaran
```
User Choose Payment Method → Complete Payment → Midtrans Notification → Update Database
```

### 3. Konfirmasi & Akses
```
Payment Success → Send Email → Grant Access → Redirect Success Page
```

## 📱 User Experience

### Payment Selection UI
- **Prioritas Visual**: GoPay, ShopeePay, QRIS, Mandiri VA ditampilkan pertama
- **Payment Icons**: Logo/icon yang familiar untuk setiap metode
- **Status Indicators**: Real-time status pembayaran
- **Mobile Optimized**: Responsive untuk semua device

### Callback URLs
- **Success**: `/payment/success` - Pembayaran berhasil
- **Pending**: `/payment/pending` - Menunggu konfirmasi
- **Error**: `/payment/error` - Pembayaran gagal

## 🛡️ Keamanan

### Enkripsi & Security
- **SSL 256-bit**: Semua komunikasi terenkripsi
- **Server Key**: Disimpan di server-side only
- **Client Key**: Public key untuk frontend
- **Signature Verification**: Validasi webhook notification

### Fraud Prevention
- **Transaction Monitoring**: Real-time monitoring
- **User Verification**: Email verification required
- **Amount Validation**: Server-side validation
- **Duplicate Check**: Prevent duplicate transactions

## 📊 Monitoring & Analytics

### Transaction Tracking
```sql
-- Lihat semua transaksi
SELECT * FROM payments ORDER BY created_at DESC;

-- Statistik per metode pembayaran
SELECT payment_method, COUNT(*), SUM(amount) 
FROM payments 
WHERE status = 'success' 
GROUP BY payment_method;

-- Conversion rate per payment method
SELECT 
  payment_method,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successful,
  (SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as conversion_rate
FROM payments 
GROUP BY payment_method;
```

## 🧪 Testing

### Sandbox Testing
1. **Test Cards**: Gunakan test card numbers dari Midtrans
2. **E-wallet Testing**: Simulation mode di sandbox
3. **Notification Testing**: Test webhook endpoints
4. **Error Scenarios**: Test failed payments

### Production Checklist
- [ ] Update environment variables ke production
- [ ] Test dengan real payment amounts (minimal)
- [ ] Verify webhook URL accessibility
- [ ] Monitor transaction logs
- [ ] Test refund process

## 📞 Support & Troubleshooting

### Common Issues
1. **Payment Timeout**: 24 jam expiry default
2. **Webhook Failed**: Check server logs dan URL accessibility
3. **Double Payment**: Implement idempotency check
4. **Refund Requests**: Manual process via Midtrans dashboard

### Contact Information
- **Midtrans Support**: support@midtrans.com
- **Documentation**: https://docs.midtrans.com
- **Sandbox Dashboard**: https://dashboard.sandbox.midtrans.com
- **Production Dashboard**: https://dashboard.midtrans.com

---

*Last Updated: 2024*
*Platform: Next.js + Midtrans*
*Status: Production Ready*
