-- Railway Database Setup
-- Run this script in Railway's data console

-- Drop existing foreign key constraints if they exist
SET FOREIGN_KEY_CHECKS = 0;

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS email_logs;
DROP TABLE IF EXISTS category_purchases;
DROP TABLE IF EXISTS download_history;
DROP TABLE IF EXISTS ebook_reviews;
DROP TABLE IF EXISTS ebooks;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS user_subscriptions;
DROP TABLE IF EXISTS subscription_plans;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS downloads;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  original_price DECIMAL(10,2) DEFAULT NULL,
  drive_link VARCHAR(500) DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create ebooks table
CREATE TABLE IF NOT EXISTS ebooks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id INT,
  file_url VARCHAR(500),
  cover_image VARCHAR(500),
  author VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create category_purchases table
CREATE TABLE IF NOT EXISTS category_purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  purchase_amount DECIMAL(10,2) NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed', 'cancelled') DEFAULT 'pending',
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255) UNIQUE,
  midtrans_order_id VARCHAR(255) UNIQUE,
  purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_category (user_id, category_id)
);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  email_type ENUM('purchase_confirmation', 'drive_link') DEFAULT 'purchase_confirmation',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  email_status ENUM('sent', 'failed') DEFAULT 'sent',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Insert sample categories with correct pricing and real Google Drive links
INSERT INTO categories (name, description, price, original_price, drive_link) VALUES
('Bisnis & Entrepreneurship', 'Koleksi lengkap 100+ ebook tentang strategi bisnis, entrepreneurship, startup, manajemen, dan pengembangan usaha dari pemula hingga advanced.', 15000, 25000, 'https://drive.google.com/drive/folders/1o_O_lwAVqiyZxJEBnE-9aws5lScSMmH-?usp=drive_link'),
('Digital Marketing', 'Panduan lengkap 100+ ebook digital marketing dari basic hingga advanced. SEO, SEM, Social Media Marketing, Content Marketing, Email Marketing, dan strategi digital terbaru.', 12000, 20000, 'https://drive.google.com/drive/folders/1SU3EbZ1TCsZ4TL1RTb3rcd_Bc4eeq5vj?usp=drive_link'),
('Kesehatan & Lifestyle', 'Koleksi 100+ ebook tentang kesehatan, fitness, nutrition, mental health, mindfulness, healthy cooking, dan gaya hidup sehat.', 10000, 18000, 'https://drive.google.com/drive/folders/13kHX_d1BjAtS1mxObgia91-zyhVkeMu7?usp=drive_link'),
('Keuangan & Investasi', 'Panduan finansial personal dan investasi cerdas. 100+ ebook tentang budgeting, saving strategies, stock investment, cryptocurrency, real estate, dan financial freedom planning.', 15000, 25000, 'https://drive.google.com/drive/folders/1Qnlow_bAjXCwnpHOy2b1t0c809ETPRZI?usp=drive_link'),
('Kreatif & Desain', 'Keterampilan kreatif dan desain profesional. 100+ ebook tentang graphic design, photography, video editing, content creation, branding, dan creative business.', 12000, 20000, 'https://drive.google.com/drive/folders/1ZK5V5sj33pQecTkgxuKHBqgCbLDXaYF1?usp=drive_link'),
('Pendidikan & Pengembangan Diri', 'Pengembangan diri dan produktivitas maksimal. 100+ ebook tentang time management, leadership, communication skills, habit building, dan personal branding.', 10000, 18000, 'https://drive.google.com/drive/folders/1hVzrqSDMcQhGVO_f_v9GU7634aiXShRi?usp=drive_link'),
('Teknologi & Programming', 'Koleksi ebook teknologi dan programming terdepan. 100+ ebook tentang web development, mobile apps, AI/ML, blockchain, cybersecurity, dan emerging technologies.', 15000, 25000, 'https://drive.google.com/drive/folders/1ul9fwSLw_FPHRlj2y4BjXI4-XGWDOyU8?usp=drive_link');
