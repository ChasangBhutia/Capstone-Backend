const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const { generateToken } = require("../utils/generateToken");
const Student = require("../models/studentModel");


module.exports.createUser = async (req, res) => {
    const {
        fullname,
        email,
        password,
        role,
        branch,
        student,
        descriptor
    } = req.body;

    if (!fullname || !email || !password || !role) {
        return res.status(400).json({
            success: false,
            error: "All fields are required"
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        let studentIds = [];

        // 🔥 FIX: use "students" not "student"
        if (role === "parent" && Array.isArray(student) && student.length > 0) {

            const createdStudents = await Student.insertMany(
                student.map(s => ({
                    studentName: s.name,
                    class: s.class,
                    descriptors: descriptor ? descriptor : []
                }))
            );

            studentIds = createdStudents.map(s => s._id);
        }

        const userData = {
            fullname,
            email,
            password: hash,
            role,
        };

        if (role === "staff") {
            userData.branch = branch;
        }

        if (role === "parent") {
            userData.student = studentIds;
            userData.descriptor = descriptor;
        }

        const newUser = await User.create(userData);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, error: "All fields are required." });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).json({ success: false, error: "No user found with this email. Please create one!" });
        }
        const result = await bcrypt.compare(password, existingUser.password);
        if (!result) {
            return res.status(401).json({ success: false, error: "Please enter valid credentials." });
        }
        const token = generateToken(existingUser.email, existingUser.role, existingUser._id);
        const userResponse = existingUser.toObject();
        delete userResponse.password;
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        return res.status(200).json({
            success: true,
            message: "User LoggedIn successfully",
            user: userResponse,
            token
        });
    } catch (err) {
        console.error("Something went wrong: ", err.message);
        return res.status(500).json({ success: false, error: "Internal Server Error." });
    }
}