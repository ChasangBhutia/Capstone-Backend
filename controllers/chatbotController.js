const chatModel = require("../models/chatModel");
const sessionModel = require("../models/sessionModel");
const { callMistral } = require('../utils/openRouter');

exports.saveChat = async (req, res) => {
    try {
        const { sessionId, prompt } = req.body;
        if (!sessionId || !prompt) return res.status(400).json({ success: false, errors: "All fields are required" });
        const message = [
            {
                role: "system",
                content:
                    "You are a professional Student Safety Consultant. Tell about the best safety rules, tips and tricks of safety rules of students mainly at school" +
                    "Reply with calm and a proper manner and be gentle. " +
                    "Tell each in detail and try to e explain in points and by giving examples"
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