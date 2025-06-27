# OAuth Setup Guide

Untuk mengaktifkan login Google dan Facebook, perlu membuat aplikasi OAuth di kedua platform dan mendapatkan credentials.

## 🔵 Google OAuth Setup

1. **Buka Google Cloud Console**
   - Kunjungi: https://console.developers.google.com
   - Login dengan akun Google Anda

2. **Buat Project Baru atau Pilih Project**
   - Klik "Select a project" → "New Project"
   - Nama project: "Digital Marketing Ebook"
   - Klik "Create"

3. **Aktifkan Google+ API**
   - Di sidebar, pilih "APIs & Services" → "Library"
   - Cari "Google+ API" dan klik "Enable"

4. **Buat OAuth 2.0 Credentials**
   - Pilih "APIs & Services" → "Credentials"
   - Klik "Create Credentials" → "OAuth client ID"
   - Pilih "Web application"
   - Nama: "Digital Marketing Ebook Web"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Klik "Create"

5. **Copy Credentials**
   - Copy Client ID dan Client Secret
   - Paste ke file `.env.local`:
     ```
     GOOGLE_CLIENT_ID=your-actual-google-client-id
     GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
     ```

## 🔵 Facebook OAuth Setup

1. **Buka Facebook Developers**
   - Kunjungi: https://developers.facebook.com
   - Login dengan akun Facebook Anda

2. **Buat App Baru**
   - Klik "My Apps" → "Create App"
   - Pilih "Consumer" → "Next"
   - App Name: "Digital Marketing Ebook"
   - Contact Email: email Anda
   - Klik "Create App"

3. **Add Facebook Login Product**
   - Di dashboard app, klik "Add Product"
   - Pilih "Facebook Login" → "Set Up"
   - Pilih "Web"
   - Site URL: `http://localhost:3000`

4. **Configure OAuth Settings**
   - Di sidebar, pilih "Facebook Login" → "Settings"
   - Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
   - Klik "Save Changes"

5. **Lengkapi Data Aplikasi (Wajib untuk Facebook Login)**
   - Di sidebar, pilih "Settings" → "Basic"
   - **App Icon**: 
     * Buka file `public/app-icon.svg` yang sudah saya buat
     * Convert ke PNG 1024x1024px (bisa pakai online converter seperti cloudconvert.com)
     * Upload PNG tersebut sebagai App Icon
   - **Privacy Policy URL**: `http://localhost:3000/privacy`
   - **Category**: Pilih "Business" atau "Education" 
   - **Data Deletion Instructions**: Isi dengan:
     ```
     Users can request data deletion by emailing support@example.com. 
     We will process deletion requests within 30 days as outlined in our Privacy Policy.
     ```
   - Klik "Save Changes"

6. **Copy App Credentials**
   - Masih di "Settings" → "Basic"
   - Copy App ID dan App Secret
   - Paste ke file `.env.local`:
     ```
     FACEBOOK_CLIENT_ID=your-actual-facebook-app-id
     FACEBOOK_CLIENT_SECRET=your-actual-facebook-app-secret
     ```rlu membuat aplikasi OAuth di kedua platform dan mendapatkan credentials.

## 🔵 Google OAuth Setup

1. **Buka Google Cloud Console**
   - Kunjungi: https://console.developers.google.com
   - Login dengan akun Google Anda

2. **Buat Project Baru atau Pilih Project**
   - Klik "Select a project" → "New Project"
   - Nama project: "Digital Marketing Ebook"
   - Klik "Create"

3. **Aktifkan Google+ API**
   - Di sidebar, pilih "APIs & Services" → "Library"
   - Cari "Google+ API" dan klik "Enable"

4. **Buat OAuth 2.0 Credentials**
   - Pilih "APIs & Services" → "Credentials"
   - Klik "Create Credentials" → "OAuth client ID"
   - Pilih "Web application"
   - Nama: "Digital Marketing Ebook Web"
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Klik "Create"

5. **Copy Credentials**
   - Copy Client ID dan Client Secret
   - Paste ke file `.env.local`:
     ```
     GOOGLE_CLIENT_ID=your-actual-google-client-id
     GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
     ```

## 🔵 Facebook OAuth Setup

1. **Buka Facebook Developers**
   - Kunjungi: https://developers.facebook.com
   - Login dengan akun Facebook Anda

2. **Buat App Baru**
   - Klik "My Apps" → "Create App"
   - Pilih "Consumer" → "Next"
   - App Name: "Digital Marketing Ebook"
   - Contact Email: email Anda
   - Klik "Create App"

3. **Lengkapi App Settings (Required)**
   - Di sidebar, pilih "Settings" → "Basic"
   - **App Icon**: Upload ikon 1024x1024px (bisa logo sederhana atau gunakan generator online)
   - **Privacy Policy URL**: `http://localhost:3000/privacy` (akan kita buat nanti)
   - **User Data Deletion**: `http://localhost:3000/delete-data` (akan kita buat nanti)  
   - **Category**: Pilih "Business" atau "Productivity"
   - Klik "Save Changes"

4. **Setup Facebook Login**
   - Di dashboard app, klik "Add Product"
   - Pilih "Facebook Login" → "Set Up"
   - Pilih "Web"
   - Site URL: `http://localhost:3000`

5. **Configure OAuth Settings**
   - Di sidebar, pilih "Facebook Login" → "Settings"
   - Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`
   - Klik "Save Changes"

6. **Copy App Credentials**
   - Di sidebar, pilih "Settings" → "Basic"
   - Copy App ID dan App Secret
   - Paste ke file `.env.local`:
     ```
     FACEBOOK_CLIENT_ID=your-actual-facebook-app-id
     FACEBOOK_CLIENT_SECRET=your-actual-facebook-app-secret
     ```

## 🔄 Setelah Setup

1. **Restart Development Server**
   ```bash
   npm run dev
   ```

2. **Test Login**
   - Buka http://localhost:3000
   - Klik "Login" atau "Get Started"
   - Test login dengan Google dan Facebook
   - Test download ebook setelah login

## ⚠️ Catatan Penting

- Jangan commit file `.env.local` ke repository
- Untuk production, update URLs dari `localhost:3000` ke domain production Anda
- Pastikan domain production ditambahkan ke authorized origins/redirect URIs
- Untuk Facebook: ubah app dari Development Mode ke Live Mode setelah testing selesai

## 🔍 Troubleshooting

### Google OAuth Issues

**Error "The OAuth client was not found" (invalid_client):**
1. **Periksa Credentials**
   - Double-check Client ID dan Client Secret di `.env.local`
   - Pastikan tidak ada spasi di awal/akhir
   - Pastikan menggunakan "Web application" credentials, bukan "Desktop" atau "Mobile"

2. **Authorized Redirect URIs Must Match Exactly**
   - Di Google Console, pastikan ada: `http://localhost:3000/api/auth/callback/google`
   - Tidak boleh ada trailing slash atau path tambahan

3. **Enable Required APIs**
   - Google+ API (Legacy) - WAJIB untuk NextAuth
   - People API - Direkomendasikan
   - Gmail API - Opsional

4. **OAuth Consent Screen**
   - Pastikan consent screen sudah dipublikasi
   - Jika masih "Testing", tambahkan test users
   - Tunggu 5-10 menit setelah perubahan consent screen

5. **Clear Cache & Restart**
   - Restart Next.js development server
   - Clear browser cache dan cookies
   - Coba incognito/private browsing mode
   - Logout dari semua akun Google di browser

### Facebook OAuth Issues

**Error "App Not Setup":**
- Lengkapi semua data aplikasi yang wajib (icon, privacy policy, category)
- Pastikan aplikasi tidak dalam mode restricted

**Error "redirect_uri_mismatch":**
- Pastikan redirect URI exact match dengan yang didaftarkan
- Cek tidak ada trailing slash atau typo

**Error "invalid_client":**
- Pastikan Client ID dan Secret benar
- Cek tidak ada extra spaces di .env.local

**Login berhasil tapi tidak redirect:**
- Restart development server setelah mengubah .env.local
- Clear browser cache dan cookies
