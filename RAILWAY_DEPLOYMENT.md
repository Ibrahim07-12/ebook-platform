# Deployment Guide untuk Railway

## Langkah-langkah Deploy ke Railway:

### 1. Setup Database
1. Login ke Railway.app
2. Create new project
3. Add MySQL database service
4. Copy DATABASE_URL dari environment variables
5. Buka Data tab di MySQL service
6. Paste dan jalankan script dari `railway-setup.sql`

### 2. Setup Web Service
1. Di project yang sama, tambah GitHub service
2. Connect ke repository ini
3. Railway akan auto-detect sebagai Next.js project

### 3. Environment Variables
Set environment variables berikut di Railway:

```
DATABASE_URL=mysql://...  # Auto-generated oleh Railway
NEXTAUTH_URL=https://your-app.up.railway.app
NEXTAUTH_SECRET=random-string-32-chars
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=false
```

### 4. Google OAuth Setup
1. Pergi ke Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - https://your-app.up.railway.app/api/auth/callback/google
4. Copy Client ID dan Client Secret ke Railway environment variables

### 5. Midtrans Setup
1. Login ke Midtrans Dashboard
2. Copy Server Key dan Client Key
3. Set ke Railway environment variables
4. Untuk production, set `MIDTRANS_IS_PRODUCTION=true`

### 6. Deploy
1. Push code ke GitHub
2. Railway akan auto-deploy
3. Monitor deployment di Railway dashboard

### 7. Testing
1. Test Google OAuth login
2. Test payment flow dengan Midtrans
3. Test database connections
4. Verify email functionality (jika digunakan)

## Production Checklist:
- [ ] Database setup dan data seeded
- [ ] Environment variables configured
- [ ] Google OAuth configured dengan domain production
- [ ] Midtrans payment gateway tested
- [ ] SSL certificate active (auto by Railway)
- [ ] Domain custom setup (optional)
- [ ] Monitoring dan logs configured

## Troubleshooting:
- Cek Railway logs untuk error messages
- Verify DATABASE_URL connection
- Test OAuth redirect URLs
- Check Midtrans webhook endpoints
