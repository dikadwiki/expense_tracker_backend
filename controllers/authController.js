// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ModelKategori } = require('../models');

// JWT Secret (sebaiknya disimpan di environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Fungsi untuk membuat kategori default (global untuk semua user)
const createDefaultKategories = async () => {
    const { ModelKategori } = require('../models');
    
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

    try {
        // Buat semua kategori default (hanya jika belum ada)
        for (const kategori of defaultKategories) {
            await ModelKategori.tambah(kategori);
        }
        console.log('✅ Kategori default berhasil dibuat (global)');
    } catch (error) {
        console.error('Error creating default categories:', error);
        // Jangan throw error, karena registrasi tetap berhasil
    }
};

class AuthController {
    // Register user baru
    static async register(req, res) {
        try {
            const { username, email, password, confirmPassword } = req.body;

            // Validasi input
            if (!username || !email || !password || !confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Semua field harus diisi'
                });
            }

            if (password !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Password dan konfirmasi password tidak cocok'
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password minimal 6 karakter'
                });
            }

            // Cek apakah email sudah terdaftar
            const existingUserByEmail = await User.findByEmail(email);
            if (existingUserByEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email sudah terdaftar'
                });
            }

            // Cek apakah username sudah terdaftar
            const existingUserByUsername = await User.findByUsername(username);
            if (existingUserByUsername) {
                return res.status(400).json({
                    success: false,
                    message: 'Username sudah terdaftar'
                });
            }

            // Buat user baru
            const userId = await User.create({ username, email, password });

            // Buat kategori default (global, hanya jika belum ada)
            await createDefaultKategories();

            // Generate JWT token
            const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                success: true,
                message: 'Registrasi berhasil',
                data: {
                    token,
                    user: {
                        id: userId,
                        username,
                        email
                    }
                }
            });

        } catch (error) {
            console.error('Register error:', error);
            console.error('Error stack:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validasi input
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email dan password harus diisi'
                });
            }

            // Cari user berdasarkan email
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }

            // Verifikasi password
            const isPasswordValid = await User.verifyPassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Email atau password salah'
                });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

            res.json({
                success: true,
                message: 'Login berhasil',
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email
                    }
                }
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server'
            });
        }
    }

    // Get user profile
    static async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }

            res.json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server'
            });
        }
    }

    // Update user profile
    static async updateProfile(req, res) {
        try {
            const { username, email } = req.body;
            const userId = req.user.userId;

            // Validasi input
            if (!username || !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Username dan email harus diisi'
                });
            }

            // Cek apakah email sudah digunakan oleh user lain
            const existingUserByEmail = await User.findByEmail(email);
            if (existingUserByEmail && existingUserByEmail.id !== userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Email sudah digunakan'
                });
            }

            // Cek apakah username sudah digunakan oleh user lain
            const existingUserByUsername = await User.findByUsername(username);
            if (existingUserByUsername && existingUserByUsername.id !== userId) {
                return res.status(400).json({
                    success: false,
                    message: 'Username sudah digunakan'
                });
            }

            // Update user profile
            await User.update(userId, { username, email });

            // Get updated user
            const updatedUser = await User.findById(userId);

            res.json({
                success: true,
                message: 'Profile berhasil diupdate',
                data: updatedUser
            });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Update password
    static async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword, confirmPassword } = req.body;
            const userId = req.user.userId;

            // Validasi input
            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Semua field password harus diisi'
                });
            }

            // Validasi panjang password baru
            if (newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password baru minimal 6 karakter'
                });
            }

            // Validasi konfirmasi password
            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Password baru dan konfirmasi password tidak cocok'
                });
            }

            // Get user dengan password untuk verifikasi
            const user = await User.findByIdWithPassword(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User tidak ditemukan'
                });
            }

            // Verifikasi password lama
            const isPasswordValid = await User.verifyPassword(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Password lama tidak benar'
                });
            }

            // Update password
            await User.updatePassword(userId, newPassword);

            res.json({
                success: true,
                message: 'Password berhasil diubah'
            });
        } catch (error) {
            console.error('Update password error:', error);
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Logout (client-side will remove token)
    static async logout(req, res) {
        res.json({
            success: true,
            message: 'Logout berhasil'
        });
    }
}

module.exports = AuthController;