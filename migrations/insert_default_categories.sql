-- Script untuk insert kategori default (global untuk semua user)
-- Jalankan script ini jika kategori default tidak dibuat otomatis

-- Hapus kategori yang mungkin sudah ada dengan user_id berbeda (untuk migration)
-- Uncomment jika diperlukan:
-- DELETE FROM kategori WHERE user_id != 0 AND user_id IS NOT NULL;

-- Insert kategori default (user_id = 0 untuk kategori global)
INSERT INTO kategori (nama, deskripsi, warna, user_id, created_at, updated_at) VALUES
('Makanan & Minuman', 'Pengeluaran untuk makanan dan minuman', '#EF4444', 0, NOW(), NOW()),
('Transportasi', 'Biaya perjalanan dan transport', '#F59E0B', 0, NOW(), NOW()),
('Belanja', 'Pembelian barang kebutuhan', '#10B981', 0, NOW(), NOW()),
('Hiburan', 'Film, game, atau rekreasi', '#3B82F6', 0, NOW(), NOW()),
('Tagihan & Utilitas', 'Listrik, air, internet, telepon, dll', '#8B5CF6', 0, NOW(), NOW()),
('Kesehatan', 'Obat-obatan, check up, dll', '#EC4899', 0, NOW(), NOW()),
('Pendidikan', 'Biaya pendidikan dan kursus', '#6366F1', 0, NOW(), NOW()),
('Lainnya', 'Pengeluaran lainnya', '#6B7280', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE nama = nama;

-- Catatan: ON DUPLICATE KEY UPDATE akan skip jika kategori dengan nama yang sama sudah ada
-- Pastikan unique constraint unique_kategori_user sudah dihapus atau diubah untuk user_id = 0


