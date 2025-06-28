import mysql from 'mysql2/promise';

// Database configuration with environment variable support
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'landing_page_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
};

// Use DATABASE_URL if available (for Railway/PlanetScale)
export const db = process.env.DATABASE_URL 
  ? mysql.createPool(process.env.DATABASE_URL + '?ssl={"rejectUnauthorized":false}')
  : mysql.createPool(dbConfig);
