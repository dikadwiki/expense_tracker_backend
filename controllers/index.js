const { ModelPengeluaran, ModelKategori } = require('../models');
const { validationResult } = require('express-validator');

// Controller untuk Pengeluaran
class ControllerPengeluaran {
    // Dapatkan semua pengeluaran
    static async dapatkanSemua(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 50;
const offset = parseInt(req.query.offset) || 0;

const pengeluaran = await ModelPengeluaran.dapatkanSemua(limit, offset);

            
            res.json({
                sukses: true,
                data: pengeluaran,
                pesan: 'Data pengeluaran berhasil diambil'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal mengambil data pengeluaran',
                error: error.message
            });
        }
    }

    // Dapatkan pengeluaran berdasarkan ID
    static async dapatkanBerdasarkanId(req, res) {
        try {
            const { id } = req.params;
            const pengeluaran = await ModelPengeluaran.dapatkanBerdasarkanId(id);
            
            if (!pengeluaran) {
                return res.status(404).json({
                    sukses: false,
                    pesan: 'Pengeluaran tidak ditemukan'
                });
            }

            res.json({
                sukses: true,
                data: pengeluaran,
                pesan: 'Data pengeluaran berhasil diambil'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal mengambil data pengeluaran',
                error: error.message
            });
        }
    }

    // Tambah pengeluaran baru
    static async tambah(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    sukses: false,
                    pesan: 'Data tidak valid',
                    errors: errors.array()
                });
            }

            const idBaru = await ModelPengeluaran.tambah(req.body);
            const pengeluaranBaru = await ModelPengeluaran.dapatkanBerdasarkanId(idBaru);

            res.status(201).json({
                sukses: true,
                data: pengeluaranBaru,
                pesan: 'Pengeluaran berhasil ditambahkan'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal menambahkan pengeluaran',
                error: error.message
            });
        }
    }

    // Perbarui pengeluaran
    static async perbarui(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    sukses: false,
                    pesan: 'Data tidak valid',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const berhasil = await ModelPengeluaran.perbarui(id, req.body);
            
            if (!berhasil) {
                return res.status(404).json({
                    sukses: false,
                    pesan: 'Pengeluaran tidak ditemukan'
                });
            }

            const pengeluaranTerbaru = await ModelPengeluaran.dapatkanBerdasarkanId(id);

            res.json({
                sukses: true,
                data: pengeluaranTerbaru,
                pesan: 'Pengeluaran berhasil diperbarui'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal memperbarui pengeluaran',
                error: error.message
            });
        }
    }

    // Hapus pengeluaran
    static async hapus(req, res) {
        try {
            const { id } = req.params;
            const berhasil = await ModelPengeluaran.hapus(id);
            
            if (!berhasil) {
                return res.status(404).json({
                    sukses: false,
                    pesan: 'Pengeluaran tidak ditemukan'
                });
            }

            res.json({
                sukses: true,
                pesan: 'Pengeluaran berhasil dihapus'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal menghapus pengeluaran',
                error: error.message
            });
        }
    }

    // Dapatkan ringkasan pengeluaran
    static async dapatkanRingkasan(req, res) {
        try {
            const { bulan, tahun } = req.query;
            
            const totalPengeluaran = await ModelPengeluaran.dapatkanTotal(bulan, tahun);
            const ringkasanKategori = await ModelPengeluaran.dapatkanRingkasanKategori(bulan, tahun);

            res.json({
                sukses: true,
                data: {
                    total_pengeluaran: totalPengeluaran,
                    ringkasan_kategori: ringkasanKategori,
                    periode: {
                        bulan: bulan || 'Semua',
                        tahun: tahun || 'Semua'
                    }
                },
                pesan: 'Ringkasan pengeluaran berhasil diambil'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal mengambil ringkasan pengeluaran',
                error: error.message
            });
        }
    }
}

// Controller untuk Kategori
class ControllerKategori {
    // Dapatkan semua kategori
    static async dapatkanSemua(req, res) {
        try {
            const kategori = await ModelKategori.dapatkanSemua();
            
            res.json({
                sukses: true,
                data: kategori,
                pesan: 'Data kategori berhasil diambil'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal mengambil data kategori',
                error: error.message
            });
        }
    }

    // Dapatkan kategori berdasarkan ID
    static async dapatkanBerdasarkanId(req, res) {
        try {
            const { id } = req.params;
            const kategori = await ModelKategori.dapatkanBerdasarkanId(id);
            
            if (!kategori) {
                return res.status(404).json({
                    sukses: false,
                    pesan: 'Kategori tidak ditemukan'
                });
            }

            res.json({
                sukses: true,
                data: kategori,
                pesan: 'Data kategori berhasil diambil'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal mengambil data kategori',
                error: error.message
            });
        }
    }

    // Tambah kategori baru
    static async tambah(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    sukses: false,
                    pesan: 'Data tidak valid',
                    errors: errors.array()
                });
            }

            const idBaru = await ModelKategori.tambah(req.body);
            const kategoriBaru = await ModelKategori.dapatkanBerdasarkanId(idBaru);

            res.status(201).json({
                sukses: true,
                data: kategoriBaru,
                pesan: 'Kategori berhasil ditambahkan'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal menambahkan kategori',
                error: error.message
            });
        }
    }

    // Perbarui kategori
    static async perbarui(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    sukses: false,
                    pesan: 'Data tidak valid',
                    errors: errors.array()
                });
            }

            const { id } = req.params;
            const berhasil = await ModelKategori.perbarui(id, req.body);
            
            if (!berhasil) {
                return res.status(404).json({
                    sukses: false,
                    pesan: 'Kategori tidak ditemukan'
                });
            }

            const kategoriTerbaru = await ModelKategori.dapatkanBerdasarkanId(id);

            res.json({
                sukses: true,
                data: kategoriTerbaru,
                pesan: 'Kategori berhasil diperbarui'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal memperbarui kategori',
                error: error.message
            });
        }
    }

    // Hapus kategori
    static async hapus(req, res) {
        try {
            const { id } = req.params;
            const berhasil = await ModelKategori.hapus(id);
            
            if (!berhasil) {
                return res.status(404).json({
                    sukses: false,
                    pesan: 'Kategori tidak ditemukan'
                });
            }

            res.json({
                sukses: true,
                pesan: 'Kategori berhasil dihapus'
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal menghapus kategori',
                error: error.message
            });
        }
    }
}

module.exports = {
    ControllerPengeluaran,
    ControllerKategori
};