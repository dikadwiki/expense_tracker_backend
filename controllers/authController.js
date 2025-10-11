// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret (sebaiknya disimpan di environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

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
            res.status(500).json({
                success: false,
                message: 'Terjadi kesalahan server'
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

    // Logout (client-side will remove token)
    static async logout(req, res) {
        res.json({
            success: true,
            message: 'Logout berhasil'
        });
    }
}

module.exports = AuthController;