const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    assignments: [{
        title: String,
        marks: Number,
        submitted: Boolean
    }],
    activities: [{
        name: String,
        score: Number
    }],
    class: String,
    roll: Number,
    descriptors: [Number],
    bus: String
})

module.exports = mongoose.model('student', StudentSchema)