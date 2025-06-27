# Environment Variables untuk Vercel Deployment

## Database Configuration
```
DATABASE_URL=mysql://root:TWRVcujEljKPGhGPQsBldRrwGoOudXZP@mysql.railway.internal:3306/railway
```

## NextAuth Configuration
```
NEXTAUTH_URL=https://ebook-platform-iota.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here-min-32-chars
```

## Google OAuth (untuk login)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Midtrans Payment (untuk pembayaran)
```
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
```

## Cara Setup di Vercel:
1. Buka https://vercel.com/dashboard
2. Pilih project "ebook-platform"
3. Masuk ke Settings > Environment Variables
4. Tambahkan semua environment variables di atas
5. Deploy ulang aplikasi

## Langkah Selanjutnya:
1. Setup Google OAuth Console
2. Setup Midtrans Account
3. Generate NEXTAUTH_SECRET
4. Test aplikasi di production
