import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('=== CREATING TEST USER ===');
    
    const testEmail = 'test@example.com';
    const testPassword = '123456';
    const testName = 'Test User';
    
    // Check if user already exists
    console.log('Checking if test user already exists...');
    const [existingUsers] = await db.query(
      'SELECT id, email FROM users WHERE email = ?',
      [testEmail]
    );
    
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      console.log('✅ Test user already exists');
      return res.status(200).json({
        success: true,
        message: 'Test user already exists',
        user: existingUsers[0],
        credentials: { email: testEmail, password: testPassword }
      });
    }
    
    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    
    // Create test user
    console.log('Creating test user...');
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, email_verified, created_at) VALUES (?, ?, ?, ?, NOW())',
      [testName, testEmail, hashedPassword, true]
    );
    
    console.log('✅ Test user created successfully');
    
    res.status(200).json({
      success: true,
      message: 'Test user created successfully',
      userId: (result as any).insertId,
      credentials: { 
        email: testEmail, 
        password: testPassword 
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
