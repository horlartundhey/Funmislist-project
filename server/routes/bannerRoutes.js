const express = require('express');
const {
  getBannersByPosition,
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  toggleBannerStatus
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

// Public routes
router.get('/position/:position', getBannersByPosition);

// Admin routes
router.get('/', protect, admin, getAllBanners);
router.get('/:id', protect, admin, getBannerById);
router.post('/', protect, admin, upload.single('image'), createBanner);
router.put('/:id', protect, admin, upload.single('image'), updateBanner);
router.delete('/:id', protect, admin, deleteBanner);
router.put('/:id/toggle', protect, admin, toggleBannerStatus);

module.exports = router;
