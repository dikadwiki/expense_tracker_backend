const { ModelPengeluaran, ModelKategori } = require('../models');
const { validationResult } = require('express-validator');

// Controller untuk Pengeluaran
class ControllerPengeluaran {
    // Dapatkan semua pengeluaran
    static async dapatkanSemua(req, res) {
        try {
            const userId = req.user.userId;
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;

            const pengeluaran = await ModelPengeluaran.dapatkanSemua(userId, limit, offset);

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
            const userId = req.user.userId;
            const pengeluaran = await ModelPengeluaran.dapatkanBerdasarkanId(id, userId);
            
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

            const userId = req.user.userId;
            const idBaru = await ModelPengeluaran.tambah(req.body, userId);
            const pengeluaranBaru = await ModelPengeluaran.dapatkanBerdasarkanId(idBaru, userId);

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
            const userId = req.user.userId;
            const berhasil = await ModelPengeluaran.perbarui(id, req.body, userId);
            
            if (!berhasil) {
                return res.status(404).json({
                    sukses: false,
                    pesan: 'Pengeluaran tidak ditemukan'
                });
            }

            const pengeluaranTerbaru = await ModelPengeluaran.dapatkanBerdasarkanId(id, userId);

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
            const userId = req.user.userId;
            const berhasil = await ModelPengeluaran.hapus(id, userId);
            
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
            const userId = req.user.userId;
            const { bulan, tahun } = req.query;
            
            const totalPengeluaran = await ModelPengeluaran.dapatkanTotal(userId, bulan, tahun);
            const ringkasanKategori = await ModelPengeluaran.dapatkanRingkasanKategori(userId, bulan, tahun);

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

// Fungsi untuk membuat kategori default (global untuk semua user)
const createDefaultKategories = async () => {
    const defaultKategories = [
        {
            nama: 'Makanan & Minuman',
            deskripsi: 'Pengeluaran untuk makanan dan minuman',
            warna: '#EF4444'
        },
        {
            nama: 'Transportasi',
            deskripsi: 'Biaya perjalanan dan transport',
            warna: '#F59E0B'
        },
        {
            nama: 'Belanja',
            deskripsi: 'Pembelian barang kebutuhan',
            warna: '#10B981'
        },
        {
            nama: 'Hiburan',
            deskripsi: 'Film, game, atau rekreasi',
            warna: '#3B82F6'
        },
        {
            nama: 'Tagihan & Utilitas',
            deskripsi: 'Listrik, air, internet, telepon, dll',
            warna: '#8B5CF6'
        },
        {
            nama: 'Kesehatan',
            deskripsi: 'Obat-obatan, check up, dll',
            warna: '#EC4899'
        },
        {
            nama: 'Pendidikan',
            deskripsi: 'Biaya pendidikan dan kursus',
            warna: '#6366F1'
        },
        {
            nama: 'Lainnya',
            deskripsi: 'Pengeluaran lainnya',
            warna: '#6B7280'
        }
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const kategori of defaultKategories) {
        try {
            const id = await ModelKategori.tambah(kategori);
            if (id) {
                successCount++;
                console.log(`✅ Kategori "${kategori.nama}" OK (ID: ${id})`);
            }
        } catch (error) {
            console.error(`❌ Error creating kategori "${kategori.nama}":`, error.message);
            console.error('Error code:', error.code);
            if (error.sql) {
                console.error('SQL:', error.sql);
            }
            errorCount++;
            // Continue dengan kategori berikutnya, jangan throw
        }
    }

    console.log(`📊 Kategori default: ${successCount}/${defaultKategories.length} berhasil, ${errorCount} error`);
    return successCount > 0;
};

// Controller untuk Kategori
class ControllerKategori {
    // Dapatkan semua kategori (global untuk semua user)
    static async dapatkanSemua(req, res) {
        try {
            let kategori = await ModelKategori.dapatkanSemua();
            console.log(`📋 Jumlah kategori saat ini: ${kategori.length}`);
            
            // Jika belum ada kategori, buat kategori default
            if (kategori.length === 0) {
                console.log('⚠️ Belum ada kategori di database, membuat kategori default...');
                
                try {
                    const success = await createDefaultKategories();
                    console.log(`✅ createDefaultKategories result: ${success}`);
                    
                    // Ambil ulang kategori setelah dibuat
                    kategori = await ModelKategori.dapatkanSemua();
                    console.log(`📋 Jumlah kategori setelah dibuat: ${kategori.length}`);
                    
                    if (kategori.length === 0) {
                        console.error('❌ ERROR: Kategori default tidak berhasil dibuat!');
                        // Coba sekali lagi
                        await createDefaultKategories();
                        kategori = await ModelKategori.dapatkanSemua();
                    }
                } catch (createError) {
                    console.error('❌ Error saat membuat kategori default:', createError);
                    console.error('Error details:', createError.message);
                    console.error('Error stack:', createError.stack);
                }
            }
            
            res.json({
                sukses: true,
                data: kategori || [],
                pesan: kategori && kategori.length > 0 ? 'Data kategori berhasil diambil' : 'Belum ada kategori'
            });
        } catch (error) {
            console.error('❌ Error di ControllerKategori.dapatkanSemua:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                sukses: false,
                pesan: 'Gagal mengambil data kategori',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

}

module.exports = {
    ControllerPengeluaran,
    ControllerKategori
};