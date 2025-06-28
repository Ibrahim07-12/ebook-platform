import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('=== CHECKING USERS IN DATABASE ===');
    
    // Test database connection
    console.log('Testing database connection...');
    const [connectionTest] = await db.query('SELECT 1 as test');
    console.log('✅ Database connection successful');
    
    // Check if users table exists
    console.log('Checking if users table exists...');
    const [tables] = await db.query("SHOW TABLES LIKE 'users'");
    
    if (Array.isArray(tables) && tables.length === 0) {
      console.log('❌ Users table does not exist');
      return res.status(200).json({
        success: false,
        message: 'Users table does not exist',
        needsSetup: true
      });
    }
    
    console.log('✅ Users table exists');
    
    // Get all users
    console.log('Fetching all users...');
    const [users] = await db.query('SELECT id, name, email, created_at FROM users');
    console.log('Users found:', users);
    
    // Get user count
    const [countResult] = await db.query('SELECT COUNT(*) as count FROM users');
    const userCount = Array.isArray(countResult) ? (countResult[0] as any).count : 0;
    
    res.status(200).json({
      success: true,
      userCount,
      users,
      hasUsers: userCount > 0
    });
    
  } catch (error) {
    console.error('❌ Database error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      needsSetup: true
    });
  }
}
