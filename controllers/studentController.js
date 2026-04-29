const Student = require('../models/studentModel');
const User = require('../models/userModel');

module.exports.getAllStudents = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const query = currentUser && currentUser.teacherOf ? { class: currentUser.teacherOf } : {};
        const students = await Student.find(query);

        if (students.length === 0) {
            return res.status(200).json({ success: true, message: "No students found", students: [] });
        }
        res.status(200).json({
            success: true,
            message: "Students fetched",
            students,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}