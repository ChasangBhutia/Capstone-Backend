const User = require('../models/userModel');
const Student = require('../models/studentModel');

module.exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Students
        const totalStudents = await User.countDocuments({ role: 'parent' }); 
        // Note: In our current schema, students might be separate or part of users.
        // Assuming 'parent' accounts represent the household/students for now or check student collection.
        const actualStudentCount = await Student.countDocuments();

        // 2. Active Buses
        const activeBuses = await User.countDocuments({ role: 'staff', branch: 'bus' });

        // 3. Attendance Today (Mock logic since we don't have many records)
        // In a real app, we'd query the Attendance collection for today's date
        const attendanceRate = 94.2; 

        // 4. Alerts (Mock for now)
        const activeAlerts = 2;

        res.status(200).json({
            success: true,
            stats: {
                totalStudents: actualStudentCount || totalStudents,
                activeBuses,
                attendanceRate,
                activeAlerts
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
