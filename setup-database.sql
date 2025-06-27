-- Script untuk setup database yang lengkap

-- Buat tabel products terlebih dahulu
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert produk contoh
INSERT INTO products (id, name, description, file_path) VALUES 
(1, 'Produk Digital Sample', 'Ini adalah produk digital sample untuk download', '/downloads/sample-product.zip')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Hapus foreign key constraint jika ada (untuk menghindari error)
ALTER TABLE downloads DROP FOREIGN KEY IF EXISTS downloads_ibfk_1;
ALTER TABLE downloads DROP FOREIGN KEY IF EXISTS downloads_product_id_foreign;

-- Tambah foreign key constraint yang benar
ALTER TABLE downloads 
ADD CONSTRAINT downloads_product_id_foreign 
FOREIGN KEY (product_id) REFERENCES products(id) 
ON DELETE CASCADE ON UPDATE CASCADE;
