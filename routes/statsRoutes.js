const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/overview', authMiddleware, getDashboardStats);

module.exports = router;
