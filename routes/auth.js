// routes/auth.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Route untuk register
router.post('/register', AuthController.register);

// Route untuk login
router.post('/login', AuthController.login);

// Route untuk get profile (perlu autentikasi)
router.get('/profile', auth, AuthController.getProfile);

// Route untuk logout
router.post('/logout', auth, AuthController.logout);

module.exports = router;