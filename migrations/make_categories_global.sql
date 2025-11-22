-- Script untuk membuat kategori menjadi global (untuk semua user)
-- Jalankan script ini untuk mengubah kategori dari user-specific menjadi global

-- 1. Hapus unique constraint yang menghalangi kategori global
ALTER TABLE kategori 
DROP INDEX IF EXISTS unique_kategori_user;

-- 2. Update semua kategori existing menjadi global (user_id = 0)
UPDATE kategori SET user_id = 0 WHERE user_id IS NOT NULL;

-- 3. Buat unique constraint baru (hanya nama, tanpa user_id)
ALTER TABLE kategori
ADD UNIQUE KEY unique_kategori_nama (nama);

-- 4. Insert kategori default jika belum ada
INSERT INTO kategori (nama, deskripsi, warna, user_id, created_at, updated_at) 
SELECT 'Makanan & Minuman', 'Pengeluaran untuk makanan dan minuman', '#EF4444', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE nama = 'Makanan & Minuman');

INSERT INTO kategori (nama, deskripsi, warna, user_id, created_at, updated_at) 
SELECT 'Transportasi', 'Biaya perjalanan dan transport', '#F59E0B', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE nama = 'Transportasi');

INSERT INTO kategori (nama, deskripsi, warna, user_id, created_at, updated_at) 
SELECT 'Belanja', 'Pembelian barang kebutuhan', '#10B981', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE nama = 'Belanja');

INSERT INTO kategori (nama, deskripsi, warna, user_id, created_at, updated_at) 
SELECT 'Hiburan', 'Film, game, atau rekreasi', '#3B82F6', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE nama = 'Hiburan');

INSERT INTO kategori (nama, deskripsi, warna, user_id, created_at, updated_at) 
SELECT 'Tagihan & Utilitas', 'Listrik, air, internet, telepon, dll', '#8B5CF6', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE nama = 'Tagihan & Utilitas');

INSERT INTO kategori (nama, deskripsi, warna, user_id, created_at, updated_at) 
SELECT 'Kesehatan', 'Obat-obatan, check up, dll', '#EC4899', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE nama = 'Kesehatan');

INSERT INTO kategori (nama, deskripsi, warna, user_id, created_at, updated_at) 
SELECT 'Pendidikan', 'Biaya pendidikan dan kursus', '#6366F1', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE nama = 'Pendidikan');

INSERT INTO kategori (nama, deskripsi, warna, user_id, created_at, updated_at) 
SELECT 'Lainnya', 'Pengeluaran lainnya', '#6B7280', 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM kategori WHERE nama = 'Lainnya');

-- Catatan:
-- Script ini akan:
-- 1. Hapus unique constraint lama (unique_kategori_user)
-- 2. Update semua kategori menjadi user_id = 0 (global)
-- 3. Buat unique constraint baru (hanya nama, tanpa user_id)
-- 4. Insert 8 kategori default jika belum ada

