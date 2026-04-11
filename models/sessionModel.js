const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    title: String,
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'chat' }],
    active: { type: Boolean, default: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date }
});

module.exports = mongoose.model('session', sessionSchema);