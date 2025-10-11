const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { testKoneksi } = require('./config/database');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://192.168.100.17:8081',  // Add your current frontend URL
    'http://localhost:8081'        // Also add localhost version
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware untuk logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes API
app.use('/api', routes);

// Route untuk melayani file statis (jika ada)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route default
app.get('/', (req, res) => {
    res.json({
        sukses: true,
        pesan: 'Selamat datang di API Expense Tracker',
        versi: '1.0.0',
        dokumentasi: '/api/health'
    });
});

// Error handler middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            sukses: false,
            pesan: 'Format JSON tidak valid'
        });
    }

    res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan internal server',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
});

// Handler untuk route yang tidak ditemukan
app.use('*', (req, res) => {
    res.status(404).json({
        sukses: false,
        pesan: 'Route tidak ditemukan',
        path: req.originalUrl
    });
});

// Jalankan server
const startServer = async () => {
    try {
        // Test koneksi database
        await testKoneksi();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di port ${PORT}`);
            console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('❌ Gagal memulai server:', error);
        process.exit(1);
    }
};

startServer();

module.exports = app;