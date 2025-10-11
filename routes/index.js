const express = require('express');
const { body } = require('express-validator');
const { ControllerPengeluaran, ControllerKategori } = require('../controllers');

const router = express.Router();

// Middleware validasi untuk pengeluaran
const validasiPengeluaran = [
    body('judul')
        .notEmpty()
        .withMessage('Judul harus diisi')
        .isLength({ min: 3, max: 200 })
        .withMessage('Judul harus antara 3-200 karakter'),
    body('jumlah')
        .isFloat({ min: 0.01 })
        .withMessage('Jumlah harus berupa angka positif'),
    body('kategori_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID kategori harus berupa angka positif'),
    body('deskripsi')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Deskripsi maksimal 500 karakter'),
    body('tanggal_transaksi')
        .isDate()
        .withMessage('Tanggal transaksi tidak valid')
];

// Middleware validasi untuk kategori
const validasiKategori = [
    body('nama')
        .notEmpty()
        .withMessage('Nama kategori harus diisi')
        .isLength({ min: 2, max: 100 })
        .withMessage('Nama kategori harus antara 2-100 karakter'),
    body('deskripsi')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Deskripsi maksimal 500 karakter'),
    body('warna')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage('Format warna harus berupa hex color (#RRGGBB)')
];

// Routes untuk pengeluaran
router.get('/pengeluaran', ControllerPengeluaran.dapatkanSemua);
router.get('/pengeluaran/ringkasan', ControllerPengeluaran.dapatkanRingkasan);
router.get('/pengeluaran/:id', ControllerPengeluaran.dapatkanBerdasarkanId);
router.post('/pengeluaran', validasiPengeluaran, ControllerPengeluaran.tambah);
router.put('/pengeluaran/:id', validasiPengeluaran, ControllerPengeluaran.perbarui);
router.delete('/pengeluaran/:id', ControllerPengeluaran.hapus);

// Routes untuk kategori
router.get('/kategori', ControllerKategori.dapatkanSemua);
router.get('/kategori/:id', ControllerKategori.dapatkanBerdasarkanId);
router.post('/kategori', validasiKategori, ControllerKategori.tambah);
router.put('/kategori/:id', validasiKategori, ControllerKategori.perbarui);
router.delete('/kategori/:id', ControllerKategori.hapus);

// Route untuk health check
router.get('/health', (req, res) => {
    res.json({
        sukses: true,
        pesan: 'Server berjalan dengan baik',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;