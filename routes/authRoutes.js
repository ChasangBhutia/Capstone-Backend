const express = require('express');
const { createUser, login } = require('../controllers/authController');
const { authorizeRoles, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', authMiddleware, authorizeRoles("admin", "staff"), createUser);
router.post('/login', login);

module.exports = router;