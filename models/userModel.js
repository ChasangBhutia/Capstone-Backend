const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentName:{
        type:String,
        required:true
    },
    assignments:[{
        title:String,
        marks:Number,
        submitted: Boolean
    }],
    activities: [{
        name:String,
        score:Number
    }],
    attendance: {
        type:Number,
        default:0
    },
    class: String,
    roll: Number,
    descriptors: [[Number]]
})

const User = new mongoose.Schema({
    role:{
        type:String,
        enum:['parent', 'staff', 'admin'],
        required:true
    },
    fullname:{
        type: String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    branch:String,
    student: {
        type: [StudentSchema],
        default: undefined
    }
})

module.exports = mongoose.model('user',User)