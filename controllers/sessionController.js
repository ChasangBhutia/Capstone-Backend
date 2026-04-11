const sessionModel = require("../models/sessionModel");

exports.createSession = async (req, res) => {
    try {
        const session = await sessionModel.create({
            user: req.user._id,
            title: "New Chat"
        });
        return res.status(201).json({ success: true, message: "Session Created", session });
    } catch (err) {
        console.log("Error creating session: ", err.message);
        return res.status(500).json({ success: false, error: "Failed to create session" });
    }
};

exports.getUserAllSessions = async (req, res) => {
    try {
        const sessions = await sessionModel.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('chats');
        if (!sessions) return res.status(400).json({ success: false, errors: "Session not found" });
        return res.status(200).json({ success: true, message: "Session found", sessions });
    } catch (err) {
        return res.status(500).json({ success: false, error: "Failed to fetch sessions" });
    }
};

exports.getUserSession = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const session = await sessionModel.findOne({ user: req.user._id, _id: sessionId }).sort({ createdAt: -1 }).populate({
            path: 'chats',
        });
        if (!session) return res.status(400).json({ success: false, error: "Session not found" });
        return res.status(200).json({ success: true, message: "Session found", session });
    } catch (err) {
        return res.status(500).json({ success: false, error: "Failed to fetch sessions" });
    }
};