const Alert = require('../models/alertModel');

exports.broadcastAlert = async (req, res) => {
    try {
        const { type, message, target, channels } = req.body;
        
        const alert = await Alert.create({
            type,
            message,
            target,
            channels,
            sender: req.user._id
        });

        // Emit real-time socket event
        const io = req.app.get('socketio');
        io.emit('new-alert', {
            type,
            message,
            target,
            sentAt: alert.sentAt,
            senderName: req.user.fullname
        });

        res.status(201).json({ success: true, alert });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getAlertHistory = async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 }).limit(20);
        res.status(200).json({ success: true, alerts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
