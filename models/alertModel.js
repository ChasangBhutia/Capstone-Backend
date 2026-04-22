const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    type: { type: String, required: true }, // delay, emergency, reminder
    message: { type: String, required: true },
    target: { type: String, default: 'All' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sentAt: { type: Date, default: Date.now },
    channels: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
