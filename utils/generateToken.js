const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET_KEY;

module.exports.generateToken =(email, role, id)=>{
    return jwt.sign({email:email, role:role, _id:id}, key);
}