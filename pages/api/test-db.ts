import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('=== DATABASE DEBUG INFO ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 30));
    
    // Test basic connection
    console.log('Testing basic connection...');
    const [result] = await db.query('SELECT 1 as test');
    console.log('Basic connection result:', result);
    
    // Test database selection
    console.log('Testing database selection...');
    const [databases] = await db.query('SHOW DATABASES');
    console.log('Available databases:', databases);
    
    // Test current database
    const [currentDb] = await db.query('SELECT DATABASE() as current_db');
    console.log('Current database:', currentDb);
    
    // Test tables in current database
    const [tables] = await db.query('SHOW TABLES');
    console.log('Available tables:', tables);
    
    // If categories table exists, test it
    const categoryTables = (tables as any[]).filter(t => 
      Object.values(t)[0]?.toString().toLowerCase().includes('categories')
    );
    
    if (categoryTables.length > 0) {
      console.log('Categories table found, testing...');
      const [categories] = await db.query('SELECT COUNT(*) as count FROM categories');
      console.log('Categories count:', categories);
      
      const [sampleCategories] = await db.query('SELECT * FROM categories LIMIT 2');
      console.log('Sample categories:', sampleCategories);
    }
    
    res.status(200).json({
      success: true,
      debug: {
        hasDatabase: !!process.env.DATABASE_URL,
        databases,
        currentDb,
        tables,
        categoryTables
      }
    });
    
  } catch (error: any) {
    console.error('Database test error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Unknown error',
      stack: error?.stack
    });
  }
}
