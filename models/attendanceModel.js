const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    status: {
        type: String,
        enum: ["present", "absent"],
        default: 'present',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
})

module.exports = mongoose.model('attendance', AttendanceSchema);