-- Migration script untuk menambahkan user_id ke tabel pengeluaran dan kategori
-- Script ini sesuai dengan struktur database dari expense_tracker.sql
-- 
-- Script ini bisa dijalankan berulang kali (idempotent) jika diperlukan
-- Jika kolom/constraint sudah ada, query akan error tapi bisa di-skip

-- Pastikan tabel users sudah ada sebelum menjalankan script ini
-- Kolom user_id menggunakan INT NOT NULL (sesuai struktur SQL file)

-- ============================================
-- Tabel: kategori
-- ============================================

-- Hapus constraint lama jika ada (untuk re-run migration)
SET FOREIGN_KEY_CHECKS = 0;

-- Drop constraint jika sudah ada (untuk MySQL 8.0+)
-- Untuk MySQL versi lama, hapus baris ini dan handle error manual
ALTER TABLE kategori 
DROP FOREIGN KEY IF EXISTS kategori_ibfk_1;

-- Tambahkan kolom user_id
-- JIKA KOLOM SUDAH ADA, query ini akan error - skip saja dan lanjutkan ke query berikutnya
ALTER TABLE kategori 
ADD COLUMN IF NOT EXISTS user_id INT NOT NULL AFTER id;

-- Tambahkan index untuk performa (jika belum ada)
-- JIKA INDEX SUDAH ADA, query ini akan error - skip saja
ALTER TABLE kategori
ADD KEY idx_kategori_user (user_id);

-- Tambahkan unique constraint untuk (nama, user_id)
-- JIKA CONSTRAINT SUDAH ADA, query ini akan error - skip saja
ALTER TABLE kategori
ADD UNIQUE KEY unique_kategori_user (nama, user_id);

-- Tambahkan foreign key constraint
-- JIKA CONSTRAINT SUDAH ADA, query ini akan error - skip saja
ALTER TABLE kategori
ADD CONSTRAINT kategori_ibfk_1 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Tabel: pengeluaran
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

-- Drop constraint lama jika ada
ALTER TABLE pengeluaran
DROP FOREIGN KEY IF EXISTS pengeluaran_ibfk_2;

-- Tambahkan kolom user_id
ALTER TABLE pengeluaran
ADD COLUMN IF NOT EXISTS user_id INT NOT NULL AFTER id;

-- Tambahkan index untuk performa
ALTER TABLE pengeluaran
ADD KEY idx_pengeluaran_user (user_id);

-- Tambahkan foreign key constraint
ALTER TABLE pengeluaran
ADD CONSTRAINT pengeluaran_ibfk_2 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Update Data Existing (WAJIB jika ada data)
-- ============================================

-- Jika ada data existing yang user_id-nya 0, NULL, atau tidak valid
-- Assign ke user dengan id = 1 (atau user_id yang sesuai)
-- UNCOMMENT baris di bawah dan jalankan jika diperlukan:

-- UPDATE kategori SET user_id = 1 WHERE user_id IS NULL OR user_id = 0;
-- UPDATE pengeluaran SET user_id = 1 WHERE user_id IS NULL OR user_id = 0;

-- Catatan:
-- 1. Pastikan user dengan id = 1 ada di tabel users sebelum menjalankan UPDATE
-- 2. Ganti user_id = 1 dengan user_id yang sesuai dengan akun Anda
-- 3. Untuk database yang benar-benar baru (tidak ada data), bagian ini bisa di-skip

-- ============================================
-- CATATAN PENTING:
-- ============================================
-- 1. Script ini menggunakan IF NOT EXISTS dan IF EXISTS (tersedia di MySQL 8.0+)
-- 2. Untuk MySQL versi lama (< 8.0), gunakan file add_user_id_to_tables_simple.sql
-- 3. Jika kolom/constraint sudah ada, query akan error - ini normal, skip saja dan lanjutkan
-- 4. Pastikan semua data existing punya user_id yang valid sebelum menggunakan aplikasi
