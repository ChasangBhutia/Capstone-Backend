const User = require('../models/userModel');
const Student = require('../models/studentModel');
const Attendance = require('../models/attendanceModel');
const Alert = require('../models/alertModel');

module.exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Students
        const totalStudents = await User.countDocuments({ role: 'parent' });
        const actualStudentCount = await Student.countDocuments();

        // 2. Active Buses
        const activeBuses = await User.countDocuments({ role: 'staff', branch: 'bus' });

        // 3. Attendance Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todaysAttendance = await Attendance.find({
            date: { $gte: today, $lt: tomorrow }
        });

        const presentCount = todaysAttendance.filter(a => a.status === 'present').length;
        const absentCount = todaysAttendance.filter(a => a.status === 'absent').length;
        const totalMarked = presentCount + absentCount;

        const attendanceRate = totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 0;

        // 4. Alerts
        const activeAlerts = await Alert.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });

        res.status(200).json({
            success: true,
            stats: {
                totalStudents: actualStudentCount || totalStudents,
                activeBuses,
                attendanceRate,
                activeAlerts,
                presentCount,
                absentCount,
                totalMarked
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
