const Student = require("../models/studentModel");
const Attendance = require("../models/attendanceModel");
const { findBestMatch } = require("../utils/findBestMatch");

module.exports.markAttendance = async (req, res) => {
    try {
        const { descriptor, subject, studentClass } = req.body;
        // 1. Get all students
        const students = await Student.find({ class: '10' });
        if (!students) {
            console.error("No students found");
            return res.status(404).json({ success: false, message: "No students found" });
        }
        // 2. Match face
        const matchedStudent = findBestMatch(descriptor, students);

        if (!matchedStudent) {
            console.error("Face not recognized");
            return res.status(404).json({ success: false, message: "Face not recognized" });
        }

        // 3. Prevent duplicate (same day + subject)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const alreadyMarked = await Attendance.findOne({
            student: matchedStudent._id,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        if (alreadyMarked) {
            console.error("Already marked")
            return res.status(400).json({
                success: false,
                message: "Already marked today",
                student: matchedStudent.studentName,
            });
        }

        // 4. Mark attendance
        const attendance = await Attendance.create({
            student: matchedStudent._id,
            status: "present",
            teacher: req.user?._id, // if using auth middleware
            date: new Date()
        });

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            student: matchedStudent.studentName,
            attendance,
        });

    } catch (error) {
        console.error("Something went wrong: ", error)
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports.saveAttendance = async (req, res) => {
    const { sClass } = req.body;
    if (!sClass) {
        console.error("Class is required");
        return res.status(404).json({ success: false, message: "Class is required" })
    }
    try {
        const students = await Student.find({ class: sClass });
        if (students.length === 0) {
            console.error("No students found");
            return res.status(404).json({ success: false, message: "No students found" });
        }
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const presentStudents = await Attendance.find({
            student: { $in: students.map(s => s._id) },
            date: { $gte: startOfDay, $lte: endOfDay },
            status: "present"
        });

        const absentStudents = students.filter(s => !presentStudents.some(ps => ps.student.toString() === s._id.toString()));

        const attendance = await Attendance.insertMany(
            absentStudents.map(s => ({
                student: s._id,
                status: "absent",
                teacher: req.user?._id,
                date: new Date()
            }))
        );

        res.status(200).json({
            success: true,
            message: "Attendance saved successfully",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }

}

module.exports.getStudentAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;
        const attendance = await Attendance.find({ student: studentId });
        const totalPresent = attendance.filter(att => att.status === "present").length;
        const totalAbsent = attendance.filter(att => att.status === "absent").length;
        const totalAttendance = attendance.length;
        const attendancePercentge = (totalPresent / totalAttendance) * 100;
        res.status(200).json({
            success: true,
            message: "Attendance found",
            totalPresent,
            totalAbsent,
            attendancePercentge
        });
    } catch (error) {
        console.error("Something went wrong: ", error)
        res.status(500).json({ success: false, error: error.message });
    }
}