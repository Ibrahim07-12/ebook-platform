import mysql from 'mysql2/promise';

// Database configuration with environment variable support
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'miba23', // Default to your password
  database: process.env.DB_NAME || 'landing_page_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  multipleStatements: true, // Allow multiple SQL statements
  acquireTimeout: 60000,
  timeout: 60000,
};

// Use DATABASE_URL if available (for Railway/PlanetScale), otherwise use individual config
export const db = process.env.DATABASE_URL 
  ? mysql.createPool(process.env.DATABASE_URL + '?ssl={"rejectUnauthorized":false}')
  : mysql.createPool(dbConfig);

// Test database connection
export async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
