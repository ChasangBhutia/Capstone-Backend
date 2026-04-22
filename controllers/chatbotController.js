const chatModel = require("../models/chatModel");
const sessionModel = require("../models/sessionModel");
const { callMistral } = require('../utils/openRouter');
const Student = require("../models/studentModel");

exports.saveChat = async (req, res) => {
    try {
        const { sessionId, prompt } = req.body;
        if (!sessionId || !prompt) return res.status(400).json({ success: false, errors: "All fields are required" });

        // 1. Fetch Real-time Context from Database
        const students = await Student.find({}).lean();
        
        // 2. Format Context for AI
        const studentContext = students.map(s => (
            `Name: ${s.studentName}, Class: ${s.class}, Roll: ${s.roll}, Bus: ${s.bus || 'N/A'}. ` +
            `Performance: ${s.activities?.length || 0} activities, ${s.assignments?.length || 0} assignments.`
        )).join('\n');

        const message = [
            {
                role: "system",
                content:
                    "You are a professional Student Safety and Academic Consultant at SafeRoute. " +
                    "You have access to the following live student records from the database:\n" +
                    studentContext + "\n\n" +
                    "Guidelines:\n" +
                    "1. If a user asks about a specific student, use the provided records.\n" +
                    "2. If the student is not found, politely state you don't have records for that individual.\n" +
                    "3. Provide safety tips and academic advice based on the student's background if possible.\n" +
                    "4. Be professional, gentle, and answer in points."
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