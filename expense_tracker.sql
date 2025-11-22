-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 22, 2025 at 05:11 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.26
--
-- Database: `expense_tracker`
-- Struktur database untuk Expense Tracker dengan authentication
-- Setiap user memiliki data pengeluaran mereka sendiri
-- Kategori bersifat GLOBAL (digunakan bersama oleh semua user)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Table structure for table `users`
-- Tabel untuk menyimpan data user/akun
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@example.com', '$2a$12$examplehashedpassword123', '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(2, 'dikadwiki', 'dwiki@gmail.com', '$2b$12$/TtWhpqn5cjxcEHiUjVY2OAFo4d5zA9Y1.g7qIWcfFa.6TC52g8Yy', '2025-10-11 06:28:30', '2025-10-11 06:28:30');

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
-- Tabel untuk menyimpan kategori pengeluaran (makanan, transportasi, dll)
-- Kategori bersifat GLOBAL untuk semua user (user_id = 0)
-- Semua user menggunakan kategori default yang sama
--

CREATE TABLE `kategori` (
  `id` int NOT NULL,
  `nama` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `warna` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT '#3B82F6',
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `nama`, `deskripsi`, `warna`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Makanan & Minuman', 'Pengeluaran untuk makanan dan minuman', '#EF4444', 0, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(2, 'Transportasi', 'Biaya perjalanan dan transport', '#F59E0B', 0, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(3, 'Belanja', 'Pembelian barang kebutuhan', '#10B981', 0, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(4, 'Hiburan', 'Film, game, atau rekreasi', '#3B82F6', 0, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(5, 'Tagihan & Utilitas', 'Listrik, air, internet, telepon, dll', '#8B5CF6', 0, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(6, 'Kesehatan', 'Obat-obatan, check up, dll', '#EC4899', 0, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(7, 'Pendidikan', 'Biaya pendidikan dan kursus', '#6366F1', 0, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(8, 'Lainnya', 'Pengeluaran lainnya', '#6B7280', 0, '2025-10-11 04:26:30', '2025-10-11 04:26:30');

-- --------------------------------------------------------

--
-- Table structure for table `pengeluaran`
-- Tabel untuk menyimpan data pengeluaran
-- Setiap pengeluaran terikat ke user tertentu (user_id) dan memiliki kategori
--

CREATE TABLE `pengeluaran` (
  `id` int NOT NULL,
  `judul` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `jumlah` decimal(10,2) NOT NULL DEFAULT '0.00',
  `kategori_id` int NOT NULL,
  `deskripsi` text COLLATE utf8mb4_unicode_ci,
  `tanggal_transaksi` date NOT NULL,
  `user_id` int NOT NULL,
  `dibuat_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `diperbarui_pada` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pengeluaran`
--

INSERT INTO `pengeluaran` (`id`, `judul`, `jumlah`, `kategori_id`, `deskripsi`, `tanggal_transaksi`, `user_id`, `dibuat_pada`, `diperbarui_pada`) VALUES
(1, 'Makan siang di warung', 25000.00, 1, 'Nasi goreng + es teh', '2024-10-01', 1, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(2, 'Bensin motor', 50000.00, 2, 'Isi bensin untuk pergi kerja', '2024-10-02', 1, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(3, 'Beli baju baru', 150000.00, 3, 'Baju kerja di mall', '2024-10-03', 1, '2025-10-11 04:26:30', '2025-10-11 04:26:30'),
(4, 'Tiket bioskop', 75000.00, 4, 'Nonton film action', '2024-10-04', 1, '2025-10-11 04:26:30', '2025-10-11 04:26:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_username` (`username`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_kategori_nama` (`nama`),
  ADD KEY `idx_kategori_user` (`user_id`),
  ADD KEY `idx_kategori_nama` (`nama`);

--
-- Indexes for table `pengeluaran`
--
ALTER TABLE `pengeluaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pengeluaran_user` (`user_id`),
  ADD KEY `idx_pengeluaran_tanggal` (`tanggal_transaksi`),
  ADD KEY `idx_pengeluaran_kategori` (`kategori_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `pengeluaran`
--
ALTER TABLE `pengeluaran`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kategori`
-- Catatan: Kategori sekarang global (user_id = 0), jadi tidak ada foreign key constraint
-- Kategori digunakan oleh semua user secara bersama
--
-- ALTER TABLE `kategori`
--   ADD CONSTRAINT `kategori_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pengeluaran`
-- Foreign keys:
--   - pengeluaran.kategori_id -> kategori.id
--   - pengeluaran.user_id -> users.id
--
ALTER TABLE `pengeluaran`
  ADD CONSTRAINT `pengeluaran_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `pengeluaran_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
