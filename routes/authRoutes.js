const express = require('express');
const { createUser, login } = require('../controllers/authController');
const { adminMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register',adminMiddleware, createUser);
router.post('/login', login);

module.exports = router;