const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getFavorites,
    toggleFavorite,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/favorites').get(protect, getFavorites);
router.route('/favorites/:propertyId').put(protect, toggleFavorite);

module.exports = router;
