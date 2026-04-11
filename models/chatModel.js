const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'session' },
    prompt: { type: String, required: true },
    response: { type: String, require: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('chat', chatSchema);