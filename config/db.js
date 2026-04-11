const mongoose = require('mongoose');
require("dotenv").config()
const URI = process.env.MONGO_URI;

const connectDB = async ()=>{
    try{
        await mongoose.connect(URI);
        console.log("MongoDB connected!");
    }catch(err){
        console.error(`Error connecting MongoDB: ${err}`);
        process.exit(1);
    }
}

module.exports = connectDB;