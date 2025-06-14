const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const auth = require('../middleware/authMiddleware')

router.post('/register', authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationEmail);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', auth(["ADMIN", "USER"]), authController.logout);

router.get('/profile', auth(["ADMIN", "USER"]), authController.getProfile);


module.exports = router;