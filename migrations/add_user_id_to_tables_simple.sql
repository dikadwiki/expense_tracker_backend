-- Migration script SEDERHANA untuk menambahkan user_id ke tabel pengeluaran dan kategori
-- Script ini sesuai dengan struktur database dari expense_tracker.sql
-- 
-- CATATAN PENTING:
-- - Script ini untuk database yang BELUM punya kolom user_id
-- - Jika kolom sudah ada, jalankan bagian yang diperlukan saja atau skip query yang error
-- - Pastikan tabel users sudah ada sebelum menjalankan script ini

-- ============================================
-- Tabel: kategori
-- ============================================

-- Tambahkan kolom user_id
ALTER TABLE kategori 
ADD COLUMN user_id INT NOT NULL AFTER id;

-- Tambahkan index untuk performa
ALTER TABLE kategori
ADD KEY idx_kategori_user (user_id);

-- Tambahkan unique constraint untuk (nama, user_id)
-- Ini memastikan setiap user tidak bisa membuat kategori dengan nama yang sama
ALTER TABLE kategori
ADD UNIQUE KEY unique_kategori_user (nama, user_id);

-- Tambahkan foreign key constraint
ALTER TABLE kategori
ADD CONSTRAINT kategori_ibfk_1 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================
-- Tabel: pengeluaran
-- ============================================

-- Tambahkan kolom user_id
ALTER TABLE pengeluaran
ADD COLUMN user_id INT NOT NULL AFTER id;

-- Tambahkan index untuk performa
ALTER TABLE pengeluaran
ADD KEY idx_pengeluaran_user (user_id);

-- Tambahkan foreign key constraint
ALTER TABLE pengeluaran
ADD CONSTRAINT pengeluaran_ibfk_2 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================
-- Update Data Existing (WAJIB jika ada data)
-- ============================================

-- Jika ada data existing di tabel, assign ke user dengan id = 1
-- Ganti user_id = 1 dengan user_id yang sesuai dengan akun admin/user pertama Anda
UPDATE kategori SET user_id = 1 WHERE user_id = 0 OR user_id IS NULL;
UPDATE pengeluaran SET user_id = 1 WHERE user_id = 0 OR user_id IS NULL;

-- Catatan:
-- - Pastikan user dengan id = 1 ada di tabel users
-- - Jika tidak ada user dengan id = 1, buat dulu atau ganti dengan user_id yang valid


