const chatModel = require("../models/chatModel");
const sessionModel = require("../models/sessionModel");
const { callMistral } = require('../utils/openRouter');
const Student = require("../models/studentModel");
const User = require("../models/userModel");
const Attendance = require("../models/attendanceModel");

exports.saveChat = async (req, res) => {
    try {
        const { sessionId, prompt } = req.body;
        const role = req.user.role; // parent, staff, admin
        let roleInstruction = "";

        if (role === "parent") {
            roleInstruction =
                "You are speaking to a parent/guardian. " +
                "Refer to students as 'your child' or by their name. " +
                "Never greet the student directly.";
        }

        else if (role === "staff") {
            roleInstruction =
                "You are speaking to a school staff member. " +
                "Respond professionally and directly about students.";
        }

        else if (role === "admin") {
            roleInstruction =
                "You are speaking to a school administrator. " +
                "Provide concise administrative insights and summaries.";
        }

        if (!sessionId || !prompt) return res.status(400).json({ success: false, errors: "All fields are required" });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(400).json({ success: false, error: "User not found" })
        // 1. Fetch Real-time Context from Database
        const students = await Student.find({
            _id: { $in: user.student }
        }).lean();

        const attendance = await Attendance.find({
            student: { $in: user.student }
        }).lean();

        const attendanceContext = attendance.map(a => (
            `Student ID: ${a.student},
            Date: ${a.date},
            Status: ${a.status}`
        )).join('\n');

        // 2. Format Context for AI
        const studentContext = students.map(s => (
            `Name: ${s.studentName}, Class: ${s.class}, Roll: ${s.roll}, Bus: ${s.bus || 'N/A'}. ` +
            `Performance: ${s.activities?.length || 0} activities, ${s.assignments?.length || 0} assignments.`
        )).join('\n');

        const message = [
            {
                role: "system",
                content:
                    "You are SafeRoute AI, a calm, professional, and supportive school assistant.\n\n" +

                    roleInstruction + "\n\n" +

                    "Student Records:\n" +
                    studentContext + "\n\n" +

                    "Attendance Records:\n" +
                    attendanceContext + "\n\n" +

                    "Instructions:\n" +
                    "1. Give concise and genuine responses.\n" +
                    "2. Keep answers calm, human-like, and professional.\n" +
                    "3. Use only the provided database records.\n" +
                    "4. Never invent attendance, grades, or student data.\n" +
                    "5. If information is unavailable, clearly say records were not found.\n" +
                    "6. Keep responses short but informative.\n" +
                    "7. Avoid placeholders like <student name>.\n" +
                    "8. Avoid unnecessary long explanations or fake examples.\n" +
                    "9. Answer in simple readable points when needed."
            },
            {
                role: "user",
                content: prompt
            }
        ];

        const response = await callMistral(message);
        if (!response) return res.status(500).json({ success: false, error: "Internal Server Error" });

        let session = await sessionModel.findById(sessionId).populate('chats');
        if (!session) return res.status(400).json({ success: false, error: "No matching session" });


        let chat = await chatModel.create({
            user: req.user._id,
            session: sessionId,
            prompt,
            response,
        })
        if (!chat) return res.status(400).json({ success: false, error: "Unable creating Chat" });
        session.chats.push(chat._id);
        await session.save();
        return res.status(201).json({ success: true, message: "Chat Saved", chat });


    } catch (err) {
        console.log("Error saving chat: ", err.message);
        return res.status(500).json({ success: false, error: "Error saving chat" });
    }
};

exports.getChatsBySession = async (req, res) => {
    try {
        const chats = await chatModel.find({ session: req.params.sessionId })
        if (!chats) return res.status(400).json({ success: false, error: "Chats not found" });
        return res.status(200).json({ success: true, message: "Chat found", chats });
    } catch (err) {
        console.log("Error finding chats: ", err.message);
        return res.status(500).json({ success: false, error: "Error fetching chats" });
    }
};