-- Script untuk mengupdate database yang sudah ada dengan kategori dan harga yang baru

-- 1. Tambah kolom price, original_price, dan drive_link yang belum ada
ALTER TABLE categories ADD COLUMN price DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE categories ADD COLUMN original_price DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE categories ADD COLUMN drive_link TEXT;

-- 2. Hapus data categories lama
DELETE FROM categories;

-- 3. Insert data categories yang baru dengan harga sesuai spesifikasi
INSERT INTO categories (name, slug, description, icon, color, price, original_price, drive_link) VALUES
('Bisnis & Entrepreneurship', 'bisnis-entrepreneurship', 'Panduan lengkap bisnis dan entrepreneurship dari dasar hingga advanced - 100+ ebook', 'Briefcase', '#EF4444', 15000.00, 50000.00, 'https://drive.google.com/drive/folders/1o_O_lwAVqiyZxJEBnE-9aws5lScSMmH-?usp=drive_link'),
('Digital Marketing', 'digital-marketing', 'Strategi digital marketing terkini dan tools yang efektif - 100+ ebook', 'TrendingUp', '#3B82F6', 12000.00, 45000.00, 'https://drive.google.com/drive/folders/1SU3EbZ1TCsZ4TL1RTb3rcd_Bc4eeq5vj?usp=drive_link'),
('Kesehatan & Lifestyle', 'kesehatan-lifestyle', 'Tips kesehatan dan gaya hidup sehat untuk kehidupan yang lebih baik - 100+ ebook', 'Heart', '#EC4899', 10000.00, 40000.00, 'https://drive.google.com/drive/folders/13kHX_d1BjAtS1mxObgia91-zyhVkeMu7?usp=drive_link'),
('Keuangan & Investasi', 'keuangan-investasi', 'Belajar mengelola keuangan dan investasi yang menguntungkan - 100+ ebook', 'DollarSign', '#10B981', 15000.00, 50000.00, 'https://drive.google.com/drive/folders/1Qnlow_bAjXCwnpHOy2b1t0c809ETPRZI?usp=drive_link'),
('Kreatif & Desain', 'kreatif-desain', 'Panduan kreativitas, desain, dan seni untuk mengembangkan skill kreatif - 100+ ebook', 'Palette', '#06B6D4', 12000.00, 45000.00, 'https://drive.google.com/drive/folders/1ZK5V5sj33pQecTkgxuKHBqgCbLDXaYF1?usp=drive_link'),
('Pendidikan & Pengembangan Diri', 'pendidikan-pengembangan-diri', 'Materi pembelajaran dan pengembangan diri untuk meningkatkan kualitas hidup - 100+ ebook', 'BookOpen', '#8B5CF6', 10000.00, 40000.00, 'https://drive.google.com/drive/folders/1hVzrqSDMcQhGVO_f_v9GU7634aiXShRi?usp=drive_link'),
('Teknologi & Programming', 'teknologi-programming', 'Panduan teknologi terkini dan programming untuk developer - 100+ ebook', 'Code', '#F59E0B', 15000.00, 50000.00, 'https://drive.google.com/drive/folders/1ul9fwSLw_FPHRlj2y4BjXI4-XGWDOyU8?usp=drive_link');

-- 4. Buat tabel email_logs jika belum ada
CREATE TABLE IF NOT EXISTS email_logs (
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

-- 5. Buat tabel category_purchases jika belum ada
CREATE TABLE IF NOT EXISTS category_purchases (
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

-- 6. Buat tabel payment_proofs untuk manual payment
CREATE TABLE IF NOT EXISTS payment_proofs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    payment_id VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    admin_notes TEXT,
    verified_by INT,
    verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_payment_proofs (payment_id),
    INDEX idx_status_proofs (status)
);

SELECT 'Database update completed successfully!' as status;
