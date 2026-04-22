const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');

router.post('/broadcast', authMiddleware, authorizeRoles('admin', 'staff'), alertController.broadcastAlert);
router.get('/history', authMiddleware, alertController.getAlertHistory);

module.exports = router;
