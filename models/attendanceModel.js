const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required,
    },
    status:{
        type:String,
        enum:["Present", "Absent"],
        default:'Absent',
        required:true
    },
    date:Date,
    subject:String,
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    time:String
})