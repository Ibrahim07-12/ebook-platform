import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export default NextAuth({
  debug: process.env.NODE_ENV === 'development', // Only debug in development
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 LOGIN ATTEMPT:', { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          return null
        }

        try {
          console.log('🔍 Searching for user in database...');
          const [users] = await db.query(
            'SELECT id, name, email, password FROM users WHERE email = ?',
            [credentials.email]
          )

          console.log('📊 Database query result:', { 
            userCount: Array.isArray(users) ? users.length : 0,
            email: credentials.email 
          });

          if (!Array.isArray(users) || users.length === 0) {
            console.log('❌ User not found in database');
            return null
          }

          const user = users[0] as any
          console.log('👤 User found:', { id: user.id, name: user.name, email: user.email });
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log('🔑 Password validation:', { isValid: isPasswordValid });

          if (!isPasswordValid) {
            console.log('❌ Invalid password');
            return null
          }

          console.log('✅ Login successful');
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [user.email]
          )

          if (!Array.isArray(existingUsers) || existingUsers.length === 0) {
            // Create new user for social login
            await db.query(
              'INSERT INTO users (name, email, provider, provider_id, avatar, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
              [user.name, user.email, account.provider, account.providerAccountId, user.image, true]
            )
            console.log(`New ${account.provider} user created:`, user.email)
          } else {
            console.log(`Existing ${account.provider} user logged in:`, user.email)
          }
          return true
        } catch (error) {
          console.error('Social sign in error:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        try {
          const [users] = await db.query(
            'SELECT id, name, email, avatar FROM users WHERE email = ?',
            [session.user.email]
          )

          if (Array.isArray(users) && users.length > 0) {
            const user = users[0] as any
            // Update session user data
            if (session.user) {
              session.user.name = user.name
              session.user.email = user.email
              session.user.image = user.avatar || session.user.image
            }
            // Add user id to session for future use
            (session as any).userId = user.id
          }
        } catch (error) {
          console.error('Session callback error:', error)
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/', // Redirect to home page instead of default sign in page
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
})
