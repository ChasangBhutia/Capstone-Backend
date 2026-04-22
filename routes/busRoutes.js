const express = require('express');
const router = express.Router();
const { updateLocation, getAllBusLocations } = require('../controllers/busController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');

/**
 * @route   POST /api/bus/update-location
 * @desc    Update bus live location (Staff only)
 */
router.post(
    '/update-location', 
    authMiddleware, 
    authorizeRoles('staff'), 
    updateLocation
);

/**
 * @route   GET /api/bus/all
 * @desc    Get all active bus locations
 */
router.get('/all', getAllBusLocations);

module.exports = router;
