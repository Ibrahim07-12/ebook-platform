# ⚡ Quick Fix Guide - OAuth Issues

## 🔴 URGENT: Fix Facebook App Setup

Facebook login tidak akan berfungsi sampai data aplikasi dilengkapi:

### ⚡ **Quick Deploy URLs (5 menit)**

1. **Buat GitHub Repository:**
   - Buka https://github.com/new
   - Repository name: `ebook-privacy-pages`
   - Public repository
   - Create repository

2. **Upload Files:**
   - Upload file `public/privacy-standalone.html` dan `public/data-deletion.html`
   - Atau copy-paste isi file ke GitHub editor

3. **Enable GitHub Pages:**
   - Ke Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Save

4. **Get URLs (tunggu 2-3 menit):**
   - Privacy: `https://YOUR-USERNAME.github.io/ebook-privacy-pages/privacy-standalone.html`
   - Data Deletion: `https://YOUR-USERNAME.github.io/ebook-privacy-pages/data-deletion.html`

### ✅ Langkah 1: Lengkapi Facebook App Settings
1. Buka https://developers.facebook.com
2. Pilih app "Digital Marketing Ebook" Anda
3. Di sidebar, pilih **Settings** → **Basic**
4. Lengkapi data berikut:

**📱 App Icon (WAJIB):**
- Convert file `public/app-icon.svg` ke PNG 1024x1024px
- Gunakan online converter: https://cloudconvert.com/svg-to-png
- Upload PNG tersebut sebagai App Icon

**🔒 Privacy Policy URL (WAJIB):**
```
https://YOUR-USERNAME.github.io/ebook-privacy-pages/privacy-standalone.html
```
✅ **Ganti YOUR-USERNAME dengan username GitHub Anda**

**📋 Category (WAJIB):**
- Pilih "Business" atau "Education"

**🗑️ Penghapusan Data Pengguna (WAJIB):**
Pilih "URL Petunjuk Penghapusan Data" dari dropdown, lalu isi:
```
https://YOUR-USERNAME.github.io/ebook-privacy-pages/data-deletion.html
```
✅ **Ganti YOUR-USERNAME dengan username GitHub Anda**

5. **Save Changes**

### ✅ Langkah 2: Setup OAuth Redirect
1. Di sidebar pilih **Facebook Login** → **Settings**
2. Dalam **Valid OAuth Redirect URIs** masukkan:
```
http://localhost:3000/api/auth/callback/facebook
```
3. **Save Changes**

---

## 🟡 Google OAuth - Quick Check

Jika masih error "invalid_client":

### ✅ Verifikasi Credentials
1. Buka Google Cloud Console
2. Pastikan menggunakan **Web application** credentials
3. Copy ulang Client ID dan Secret yang benar
4. Update `.env.local`:
```
GOOGLE_CLIENT_ID=your-exact-client-id-here
GOOGLE_CLIENT_SECRET=your-exact-client-secret-here
```

### ✅ Authorized Redirect URIs
Pastikan exact match:
```
http://localhost:3000/api/auth/callback/google
```

### ✅ Enable APIs
- Google+ API (Legacy) ✅ WAJIB
- People API ✅ Direkomendasikan

### ✅ Test Users
Jika consent screen masih "Testing":
1. Tambahkan email Anda sebagai test user
2. Tunggu 5-10 menit

---

## 🔄 After Changes

1. **Restart server:**
```bash
npm run dev
```

2. **Clear browser:**
- Buka incognito/private window
- Atau clear cache & cookies

3. **Test login:**
- Google login should work immediately
- Facebook login will work after app settings completed

---

## 📋 Quick Status Check

**Google OAuth:** ⚠️ Working but may need credential verification  
**Facebook OAuth:** ❌ Blocked - needs app data completion  
**Privacy Policy:** ✅ Created (`/privacy`)  
**App Icon:** ✅ Created (`public/app-icon.svg`)  

**Next Steps:**
1. ✅ Complete Facebook app settings (PRIORITY)
2. ⚠️ Verify Google credentials if still failing
3. 🔄 Test both login methods
4. 🎉 Download ebook functionality should work after login!
