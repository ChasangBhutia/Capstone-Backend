const Student = require('../models/studentModel');

module.exports.getAllStudents = async (req, res) => {
    const sClass = req.query.sClass || req.body.sClass;
    try {
        const query = sClass ? { class: sClass } : {};
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