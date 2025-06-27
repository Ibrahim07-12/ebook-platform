# 🔐 Panduan Setup OAuth Credentials - STEP BY STEP

## 📋 Yang Akan Kita Lakukan:
1. ✅ Setup Google OAuth (15 menit)
2. ✅ Setup Facebook OAuth (10 menit)  
3. ✅ Update file .env.local
4. ✅ Test login sosial

---

## 🔍 GOOGLE OAUTH SETUP

### Step 1: Buka Google Cloud Console
1. **Kunjungi**: https://console.cloud.google.com/
2. **Login** dengan akun Google Anda
3. Jika diminta billing, pilih "Skip" atau "Later" untuk development

### Step 2: Buat Project Baru
1. Klik **dropdown project** di bagian atas (biasanya "My First Project")
2. Klik **"NEW PROJECT"**
3. **Project name**: `Digital Marketing Ebook`
4. Klik **"CREATE"**
5. Tunggu sampai project selesai dibuat (1-2 menit)

### Step 3: Enable Google APIs
1. Pastikan project yang baru sudah dipilih
2. Di menu samping kiri, pilih **"APIs & Services"** → **"Library"**
3. Cari **"People API"** (yang paling penting)
4. Klik pada hasil pencarian
5. Klik tombol **"ENABLE"**
6. Tunggu proses enable selesai (30 detik - 1 menit)

**📌 ATAU jika ada tombol "Create OAuth client" di dashboard:**
- Langsung klik tombol tersebut untuk shortcut

### Step 4: Setup OAuth Consent Screen (PENTING!)
1. Di menu samping kiri, pilih **"APIs & Services"** → **"OAuth consent screen"**
2. **PILIH "EXTERNAL"** (wajib pilih ini!)
   
   **📝 Penjelasan User Type:**
   - **Internal**: Hanya untuk organisasi Google Workspace (berbayar)
     - Hanya user dalam domain organisasi yang bisa login
     - Butuh Google Workspace account (bukan Gmail biasa)
   - **External**: Untuk aplikasi umum yang bisa diakses siapa saja ✅
     - Siapa saja dengan akun Google bisa login
     - Cocok untuk aplikasi publik seperti landing page kita
     
3. Klik **"CREATE"**
4. Isi form berikut:
   - **App name**: `Digital Marketing Ebook`
   - **User support email**: [email Anda]
   - **App logo**: Skip (opsional)
   - **App domain**: Skip
   - **Developer contact information**: [email Anda]
5. Klik **"SAVE AND CONTINUE"**
6. Di halaman "Scopes", langsung klik **"SAVE AND CONTINUE"**
7. Di halaman "Test users", klik **"ADD USERS"** dan tambahkan email Anda sendiri
   - **⚠️ PENTING**: App akan dalam status "Testing" sampai di-publish
   - Dalam mode testing, hanya email yang ditambahkan di sini yang bisa login
   - Untuk development, tambahkan email Anda dan email tester lain
8. Klik **"SAVE AND CONTINUE"**
9. Review summary dan klik **"BACK TO DASHBOARD"**

### Step 5: Buat OAuth 2.0 Client ID (SEDANG DI SINI! 👈)
1. ✅ **Application type**: Pilih **"Web application"** (sudah benar)
2. **Name**: Ketik `Landing Page Web Client`
3. **Authorized JavaScript origins**: 
   - Klik **"ADD URI"** 
   - Masukkan: `http://localhost:3000`
4. **Authorized redirect URIs**: 
   - Klik **"ADD URI"**
   - Masukkan: `http://localhost:3000/api/auth/callback/google`
5. Klik **"CREATE"**
8. **COPY dan SIMPAN** kedua nilai ini:
   - **Client ID**: (yang panjang berakhir .apps.googleusercontent.com)
   - **Client Secret**: (string acak panjang)

### Step 6: App Publishing Status (Opsional)
**Untuk Development (Cukup sampai di sini):**
- App akan tetap dalam status "Testing" 
- Hanya test users yang bisa login
- Perfect untuk development dan demo

**Untuk Production (Nanti setelah app jadi):**
1. Kembali ke **"OAuth consent screen"**
2. Klik **"PUBLISH APP"** 
3. Submit untuk Google review (1-2 minggu)
4. Setelah disetujui, siapa saja bisa login
---

## 📘 FACEBOOK OAUTH SETUP

### Step 1: Buka Facebook Developers
1. **Kunjungi**: https://developers.facebook.com/
2. **Login** dengan akun Facebook Anda
3. Jika diminta verifikasi nomor telepon, lakukan verifikasi

### Step 2: Buat App Baru
1. Klik **"My Apps"** di pojok kanan atas
2. Klik **"Create App"**
3. Pilih **"Consumer"** (untuk personal use)
4. Klik **"Next"**
5. Isi form:
   - **App display name**: `Digital Marketing Ebook`
   - **App contact email**: [email Anda]
6. Klik **"Create App"**
7. Mungkin diminta captcha, selesaikan

### Step 3: Setup Facebook Login Product
1. Di dashboard app, scroll ke bawah ke bagian **"Add Products"**
2. Cari **"Facebook Login"** dan klik **"Set up"**
3. Pilih platform **"Web"**
4. **Site URL**: `http://localhost:3000`
5. Klik **"Save"** dan **"Continue"**

### Step 4: Configure Facebook Login Settings
1. Di sidebar kiri, klik **"Facebook Login"** → **"Settings"**
2. Di **"Valid OAuth Redirect URIs"**, tambahkan:
   ```
   http://localhost:3000/api/auth/callback/facebook
   ```
3. Klik **"Save Changes"**

### Step 5: Get App Credentials
1. Di sidebar kiri, klik **"Settings"** → **"Basic"**
2. **COPY dan SIMPAN** kedua nilai ini:
   - **App ID**: (angka panjang)
   - **App Secret**: Klik **"Show"** dan copy

### Step 6: Set App Mode (PENTING!)
1. Di bagian atas dashboard, pastikan switch masih di **"In development"**
2. Untuk testing, app harus dalam mode development dulu
3. Nanti setelah selesai testing bisa diubah ke Live

---

## 🔧 UPDATE FILE .env.local

Sekarang ganti credentials di file `.env.local` dengan yang asli:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=super-secret-nextauth-key-2024-digital-marketing-ebook

# Google OAuth - GANTI DENGAN CREDENTIALS ASLI DARI GOOGLE CONSOLE
GOOGLE_CLIENT_ID=123456789-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx

# Facebook OAuth - GANTI DENGAN CREDENTIALS ASLI DARI FACEBOOK DEVELOPERS  
FACEBOOK_CLIENT_ID=1234567890123456
FACEBOOK_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# JWT Secret
JWT_SECRET=super-secret-jwt-key-2024-digital-marketing
```

**⚠️ PENTING**: 
- Ganti `your-google-client-id` dengan Client ID asli dari Google
- Ganti `your-google-client-secret` dengan Client Secret asli dari Google
- Ganti `your-facebook-app-id` dengan App ID asli dari Facebook
- Ganti `your-facebook-app-secret` dengan App Secret asli dari Facebook

---

## 🧪 TESTING LOGIN SOSIAL

### Step 1: Restart Development Server
```bash
# Stop server (Ctrl+C) kemudian restart
npm run dev
```

### Step 2: Test Google Login
1. Buka `http://localhost:3000`
2. Klik **"Login"** atau **"Get Started"**  
3. Klik **"Continue with Google"**
4. Login dengan akun Google Anda (yang sudah ditambahkan sebagai test user)
5. Authorize aplikasi
6. Seharusnya redirect kembali ke aplikasi dengan user sudah login
7. Cek di pojok kanan atas, seharusnya muncul nama dan avatar user

### Step 3: Test Facebook Login  
1. Logout terlebih dahulu (klik nama user → Sign Out)
2. Klik **"Login"** lagi
3. Klik **"Continue with Facebook"**
4. Login dengan akun Facebook Anda
5. Authorize aplikasi  
6. Seharusnya redirect kembali ke aplikasi dengan user sudah login

### Step 4: Test Download Tanpa Form
1. Setelah login (Google atau Facebook), scroll ke bagian download
2. Klik **"Download Free Ebook"**
3. Seharusnya langsung mulai download tanpa diminta isi form lagi

---

## ⚠️ TROUBLESHOOTING

### Error "redirect_uri_mismatch" (Google):
✅ **Solusi**: Pastikan di Google Console, Authorized redirect URIs berisi:
```
http://localhost:3000/api/auth/callback/google
```

### Error "App ID Invalid" (Facebook):
✅ **Solusi**: 
- Pastikan App ID di `.env.local` benar
- Pastikan app masih dalam mode "In development"
- Tambahkan email Anda sebagai admin/developer

### Error "Client not found":
✅ **Solusi**:
- Restart development server setelah update `.env.local`
- Pastikan credentials di `.env.local` benar
- Clear browser cache

### Login sosial tidak muncul:
✅ **Solusi**:
- Cek console browser (F12) untuk error
- Pastikan file `.env.local` sudah ter-update
- Restart server

---

## 🎉 SETELAH BERHASIL

Jika semua login sudah berhasil:
1. ✅ User bisa login manual (email/password)
2. ✅ User bisa login dengan Google  
3. ✅ User bisa login dengan Facebook
4. ✅ Setelah login, nama user muncul di navbar
5. ✅ Download ebook langsung tanpa isi form lagi
6. ✅ User bisa logout

**Selamat! 🎊 OAuth login sosial sudah berfungsi dengan sempurna!**

---

## 4. Testing

Setelah setup credentials:

1. Restart development server: `npm run dev`
2. Buka http://localhost:3000
3. Coba login dengan Google/Facebook
4. Pastikan redirect URI benar

---

## 5. Troubleshooting

### Common Issues:

1. **Invalid Client Error:**
   - Pastikan Client ID benar
   - Periksa redirect URI

2. **App Not in Development Mode:**
   - Untuk Facebook, pastikan app dalam mode development
   - Tambahkan test users jika perlu

3. **Redirect URI Mismatch:**
   - Pastikan URI di OAuth console sama dengan yang di kode
   - Format: `http://localhost:3000/api/auth/callback/[provider]`

4. **Domain Issues:**
   - Untuk production, ganti localhost dengan domain actual
   - Update NEXTAUTH_URL di production

---

## 6. Security Notes

- Jangan commit file `.env.local` ke git
- Untuk production, gunakan environment variables
- Ganti NEXTAUTH_SECRET dengan key yang kuat
- Enable HTTPS untuk production
