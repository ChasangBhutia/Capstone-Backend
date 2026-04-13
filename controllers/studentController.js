const Student = require('../models/studentModel');

module.exports.getAllStudents = async (req, res) => {
    const sClass = req.query.sClass || req.body.sClass;
    if (!sClass) {
        console.error("Class is required");
        return res.status(404).json({ success: false, message: "Class is required" });
    }
    try {
        const students = await Student.find({ class: sClass });
        if (students.length === 0) {
            console.error("No students found");
            return res.status(404).json({ success: false, message: "No students found" });
        }
        res.status(200).json({
            success: true,
            message: "Students found",
            students,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}