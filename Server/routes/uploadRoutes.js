const express = require('express');
const router = express.Router();
const { uploadImage, uploadMultipleImages, uploadMiddleware } = require('../controllers/uploadController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Single image upload
router.post('/image', isAuthenticated, uploadMiddleware.single('image'), uploadImage);

// Multiple images upload
router.post('/images', isAuthenticated, uploadMiddleware.array('images', 10), uploadMultipleImages);

module.exports = router;