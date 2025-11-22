// models/User.js
const { koneksiDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // Membuat user baru
    static async create({ username, email, password }) {
        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const [result] = await koneksiDatabase.execute(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Mencari user berdasarkan email
    static async findByEmail(email) {
        try {
            const [rows] = await koneksiDatabase.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Mencari user berdasarkan username
    static async findByUsername(username) {
        try {
            const [rows] = await koneksiDatabase.execute(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Mencari user berdasarkan ID
    static async findById(id) {
        try {
            const [rows] = await koneksiDatabase.execute(
                'SELECT id, username, email, created_at FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Memverifikasi password
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Update user profile
    static async update(id, { username, email }) {
        try {
            await koneksiDatabase.execute(
                'UPDATE users SET username = ?, email = ? WHERE id = ?',
                [username, email, id]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Update user password
    static async updatePassword(id, newPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            await koneksiDatabase.execute(
                'UPDATE users SET password = ? WHERE id = ?',
                [hashedPassword, id]
            );
            return true;
        } catch (error) {
            throw error;
        }
    }

    // Get user with password (untuk verifikasi password lama)
    static async findByIdWithPassword(id) {
        try {
            const [rows] = await koneksiDatabase.execute(
                'SELECT * FROM users WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = User;