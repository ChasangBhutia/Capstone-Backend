const express = require('express');
const { createUser, login, getUser, logout } = require('../controllers/authController');
const { authorizeRoles, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', authMiddleware, authorizeRoles("admin", "staff"), createUser);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', authMiddleware, getUser);

module.exports = router;