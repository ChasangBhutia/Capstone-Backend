const jwt = require("jsonwebtoken");

module.exports.authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    console.log("Token received:", token);

    if (!token) {
        console.log("No token found in cookies");
        return res.status(401).json({ success:false, error: "Unauthorized: No token provided" });
    }
    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decodedUser;
        console.log("Token verified. User:", decodedUser);

        next();
    } catch (err) {
        console.log("JWT verification failed:", err.message);
        return res.status(403).json({success:false, error: "Forbidden: Invalid token" });
    }
};

module.exports.adminMiddleware = async (req, res, next)=>{
    const token = req.cookies.token;
    if(!token){
        console.error("No token found in the cookies");
        return res.status(401).json({success:false, error:"No token found"});
    }
    try{
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decodedUser){
            console.error("User not found");
            return res.status(404).json({success:false, error:"User not found"});
        }
        if(decodedUser.role != "admin"){
            console.error("Access denied: Admin only");
            return res.status(403).json({success:false, error:"Access only: Admin only"});
        }
        req.user = decodedUser;
        next();
    }catch(error){
        console.error("Something went wrong: ", error);
        return res.status(500).json({success:false, error:"Internal server error"});
    }

}