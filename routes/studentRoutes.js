const express = require('express');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const { getAllStudents } = require('../controllers/studentController')
const router = express.Router();

router.get('/', authMiddleware, authorizeRoles("admin", "staff"), getAllStudents);

module.exports = router