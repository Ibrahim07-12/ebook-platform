import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('=== SETTING UP DATABASE ===');
    
    // Create users table
    console.log('Creating users table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        email_verified BOOLEAN DEFAULT FALSE,
        image VARCHAR(500),
        provider VARCHAR(50) DEFAULT 'credentials',
        provider_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create categories table
    console.log('Creating categories table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL DEFAULT 0,
        stripe_price_id VARCHAR(255),
        file_path VARCHAR(500),
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // Create products table
    console.log('Creating products table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        file_path VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create downloads table
    console.log('Creating downloads table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS downloads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        category_id INT,
        product_id INT,
        downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_category_id (category_id),
        INDEX idx_product_id (product_id)
      )
    `);
    
    // Create email_logs table
    console.log('Creating email_logs table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        category_id INT,
        email_type VARCHAR(100),
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        email_status VARCHAR(50) DEFAULT 'sent',
        INDEX idx_user_id (user_id),
        INDEX idx_category_id (category_id)
      )
    `);
    
    // Insert sample data
    console.log('Inserting sample categories...');
    await db.query(`
      INSERT IGNORE INTO categories (id, name, description, price, file_path) VALUES 
      (1, 'Digital Marketing Mastery', 'Panduan lengkap digital marketing dari A sampai Z', 97000, '/downloads/digital-marketing-mastery.zip'),
      (2, 'Social Media Marketing', 'Strategi marketing di media sosial yang efektif', 67000, '/downloads/social-media-marketing.zip'),
      (3, 'Email Marketing Pro', 'Teknik email marketing untuk meningkatkan konversi', 57000, '/downloads/email-marketing-pro.zip')
    `);
    
    console.log('Inserting sample product...');
    await db.query(`
      INSERT IGNORE INTO products (id, name, description, file_path) VALUES 
      (1, 'Produk Digital Sample', 'Ini adalah produk digital sample untuk download', '/downloads/sample-product.zip')
    `);
    
    console.log('✅ Database setup completed successfully');
    
    res.status(200).json({
      success: true,
      message: 'Database setup completed successfully'
    });
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
