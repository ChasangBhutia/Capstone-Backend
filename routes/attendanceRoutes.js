const express = require('express');
const { markAttendance, getStudentAttendance, saveAttendance, getAttendance } = require('../controllers/attendanceController');
const { authorizeRoles, authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, authorizeRoles("staff"), markAttendance);
router.get('/:studentId', authMiddleware, getStudentAttendance);
router.post('/save', authMiddleware, authorizeRoles("staff"), saveAttendance);
router.get('/', authMiddleware, authorizeRoles("staff"), getAttendance);

module.exports = router;