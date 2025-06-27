-- Enhanced Database Schema for Multi-Category Ebook Platform

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    icon VARCHAR(50),
    color VARCHAR(20) DEFAULT '#3B82F6',
    price DECIMAL(10,2) DEFAULT 0.00,
    original_price DECIMAL(10,2) DEFAULT 0.00,
    drive_link TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ebooks table
CREATE TABLE ebooks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    author VARCHAR(100),
    category_id INT,
    cover_image_url VARCHAR(255),
    file_url VARCHAR(255),
    file_size VARCHAR(20),
    pages_count INT,
    language VARCHAR(10) DEFAULT 'id',
    price DECIMAL(10,2) DEFAULT 0.00,
    discount_price DECIMAL(10,2),
    is_free BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    downloads_count INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    tags JSON,
    preview_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_price (price),
    INDEX idx_active (is_active)
);

-- Subscription plans table
CREATE TABLE subscription_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_days INT NOT NULL, -- 30, 90, 365 days
    features JSON,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User subscriptions table
CREATE TABLE user_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    status ENUM('active', 'expired', 'cancelled', 'pending') DEFAULT 'pending',
    starts_at TIMESTAMP,
    expires_at TIMESTAMP,
    payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE,
    INDEX idx_user_status (user_id, status),
    INDEX idx_expires (expires_at)
);

-- Category purchases table
CREATE TABLE category_purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_id VARCHAR(255),
    drive_link_sent BOOLEAN DEFAULT FALSE,
    status ENUM('completed', 'pending', 'failed', 'refunded') DEFAULT 'pending',
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_purchase (user_id, category_id),
    INDEX idx_user_category_purchases (user_id)
);

-- Individual ebook purchases
CREATE TABLE ebook_purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ebook_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_id VARCHAR(255),
    status ENUM('completed', 'pending', 'failed', 'refunded') DEFAULT 'pending',
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ebook_id) REFERENCES ebooks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_purchase (user_id, ebook_id),
    INDEX idx_user_purchases (user_id)
);

-- Payment transactions
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    payment_id VARCHAR(255) UNIQUE NOT NULL, -- From payment gateway
    payment_method VARCHAR(50), -- 'midtrans', 'xendit', etc
    type ENUM('subscription', 'ebook', 'bundle', 'category') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
    gateway_response JSON,
    reference_id INT, -- subscription_id or ebook_id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_payments (user_id),
    INDEX idx_status (status),
    INDEX idx_payment_id (payment_id)
);

-- User download history
CREATE TABLE download_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ebook_id INT NOT NULL,
    download_count INT DEFAULT 1,
    last_downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ebook_id) REFERENCES ebooks(id) ON DELETE CASCADE,
    INDEX idx_user_downloads (user_id),
    INDEX idx_ebook_downloads (ebook_id)
);

-- Ebook reviews and ratings
CREATE TABLE ebook_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ebook_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ebook_id) REFERENCES ebooks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (user_id, ebook_id),
    INDEX idx_ebook_rating (ebook_id, rating)
);

-- Email logs for tracking email delivery
CREATE TABLE email_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT,
    payment_id VARCHAR(255),
    email_type ENUM('category_access', 'payment_confirmation', 'subscription_reminder') DEFAULT 'category_access',
    status ENUM('sent', 'failed', 'pending') DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_user_emails (user_id),
    INDEX idx_payment_emails (payment_id)
);

-- Clear existing categories and insert updated data
DELETE FROM categories;

-- Insert sample categories with pricing sesuai spesifikasi
INSERT INTO categories (name, slug, description, icon, color, price, original_price, drive_link) VALUES
('Bisnis & Entrepreneurship', 'bisnis-entrepreneurship', 'Panduan lengkap bisnis dan entrepreneurship dari dasar hingga advanced - 100+ ebook', 'Briefcase', '#EF4444', 15000.00, 50000.00, 'https://drive.google.com/drive/folders/1o_O_lwAVqiyZxJEBnE-9aws5lScSMmH-?usp=drive_link'),
('Digital Marketing', 'digital-marketing', 'Strategi digital marketing terkini dan tools yang efektif - 100+ ebook', 'TrendingUp', '#3B82F6', 12000.00, 45000.00, 'https://drive.google.com/drive/folders/1SU3EbZ1TCsZ4TL1RTb3rcd_Bc4eeq5vj?usp=drive_link'),
('Kesehatan & Lifestyle', 'kesehatan-lifestyle', 'Tips kesehatan dan gaya hidup sehat untuk kehidupan yang lebih baik - 100+ ebook', 'Heart', '#EC4899', 10000.00, 40000.00, 'https://drive.google.com/drive/folders/13kHX_d1BjAtS1mxObgia91-zyhVkeMu7?usp=drive_link'),
('Keuangan & Investasi', 'keuangan-investasi', 'Belajar mengelola keuangan dan investasi yang menguntungkan - 100+ ebook', 'DollarSign', '#10B981', 15000.00, 50000.00, 'https://drive.google.com/drive/folders/1Qnlow_bAjXCwnpHOy2b1t0c809ETPRZI?usp=drive_link'),
('Kreatif & Desain', 'kreatif-desain', 'Panduan kreativitas, desain, dan seni untuk mengembangkan skill kreatif - 100+ ebook', 'Palette', '#06B6D4', 12000.00, 45000.00, 'https://drive.google.com/drive/folders/1ZK5V5sj33pQecTkgxuKHBqgCbLDXaYF1?usp=drive_link'),
('Pendidikan & Pengembangan Diri', 'pendidikan-pengembangan-diri', 'Materi pembelajaran dan pengembangan diri untuk meningkatkan kualitas hidup - 100+ ebook', 'BookOpen', '#8B5CF6', 10000.00, 40000.00, 'https://drive.google.com/drive/folders/1hVzrqSDMcQhGVO_f_v9GU7634aiXShRi?usp=drive_link'),
('Teknologi & Programming', 'teknologi-programming', 'Panduan teknologi terkini dan programming untuk developer - 100+ ebook', 'Code', '#F59E0B', 15000.00, 50000.00, 'https://drive.google.com/drive/folders/1ul9fwSLw_FPHRlj2y4BjXI4-XGWDOyU8?usp=drive_link');

-- Insert sample subscription plans
INSERT INTO subscription_plans (name, description, price, duration_days, features, is_popular) VALUES
('Basic Monthly', 'Akses terbatas ke koleksi ebook pilihan', 49000.00, 30, '["Akses 50+ ebook pilihan", "Download unlimited", "Update konten mingguan"]', FALSE),
('Premium Monthly', 'Akses penuh ke semua kategori dan fitur', 99000.00, 30, '["Akses semua ebook", "Download unlimited", "Akses eksklusif ebook baru", "Priority support"]', TRUE),
('Premium Yearly', 'Akses penuh dengan diskon terbaik', 999000.00, 365, '["Akses semua ebook", "Download unlimited", "Akses eksklusif ebook baru", "Priority support", "Hemat 17%"]', FALSE);

-- Update users table structure if needed
ALTER TABLE users 
ADD COLUMN subscription_status ENUM('free', 'basic', 'premium') DEFAULT 'free',
ADD COLUMN subscription_expires_at TIMESTAMP NULL,
ADD COLUMN total_spent DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN avatar_url VARCHAR(255);
