# Railway Database Configuration untuk Vercel

## Problem:
Railway MySQL menggunakan internal hostname `mysql.railway.internal` yang hanya bisa diakses dari dalam Railway network.

## Solution:
Gunakan public hostname Railway untuk external access dari Vercel.

## Updated DATABASE_URL untuk Vercel:
```
DATABASE_URL=mysql://root:TWRVcujEljKPGhGPQsBldRrwGoOudXZP@viaduct.proxy.rlwy.net:PORT/railway
```

## Cara mendapatkan PORT yang benar:
1. Buka Railway dashboard
2. Pilih project `proactive-smile`
3. Klik service MySQL
4. Cek tab "Connect" untuk public connection details
5. Copy PORT number dari public connection string

## Environment Variables untuk Vercel:
```
DATABASE_URL=mysql://root:TWRVcujEljKPGhGPQsBldRrwGoOudXZP@viaduct.proxy.rlwy.net:[PORT]/railway
NEXTAUTH_URL=https://ebook-platform-iota.vercel.app
NEXTAUTH_SECRET=f43e262c313ebecdec6454ff3bf1c9c94653724d66d010d30fbd6e5a3e398356
```

## Note:
Railway memberikan port yang berbeda untuk setiap service MySQL. 
Port ini biasanya bukan 3306 untuk external access.
