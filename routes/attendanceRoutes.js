const express = require('express');
const { markAttendance, getStudentAttendance, saveAttendance } = require('../controllers/attendanceController');
const { authorizeRoles, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, authorizeRoles("staff"), markAttendance);
router.get('/:studentId', authMiddleware, getStudentAttendance);
router.post('/save', authMiddleware, authorizeRoles("staff"), saveAttendance)

module.exports = router;