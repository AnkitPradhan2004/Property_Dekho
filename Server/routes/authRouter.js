const express = require('express');
const passport = require('passport');
const router = express.Router();
const controller = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// local auth
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.get('/me', isAuthenticated, controller.getMe);

// forgot password
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// On callback, passport will attach req.user — we will issue our JWT and redirect (or respond with JSON)
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/auth/google/failure' }), controller.googleCallback);

router.get('/google/failure', (req, res) => res.status(401).json({ message: 'Google authentication failed' }));

module.exports = router;
