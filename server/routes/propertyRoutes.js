const express = require('express');
const router = express.Router();
const {
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    getMyProperties
} = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProperties)
    .post(protect, admin, createProperty);
router.route('/myproperties').get(protect, admin, getMyProperties);
router.route('/:id')
    .get(getPropertyById)
    .put(protect, admin, updateProperty);

module.exports = router;
