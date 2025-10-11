const mysql = require('mysql2/promise');
require('dotenv').config();

const konfigurasiDatabase = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const koneksiDatabase = mysql.createPool(konfigurasiDatabase);

// Test koneksi database
const testKoneksi = async () => {
    try {
        const connection = await koneksiDatabase.getConnection();
        console.log('✅ Koneksi database berhasil');
        connection.release();
    } catch (error) {
        console.error('❌ Gagal terhubung ke database:', error.message);
    }
};

module.exports = {
    koneksiDatabase,
    testKoneksi
};