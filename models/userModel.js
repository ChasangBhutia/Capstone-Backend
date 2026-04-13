const mongoose = require('mongoose');

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
        type: [mongoose.Schema.Types.ObjectId],
        ref:'user',
        default: undefined
    }
})

module.exports = mongoose.model('user',User)