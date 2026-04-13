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

module.exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Access denied: ${roles.join(", ")} only`,
            });
        }

        next();
    };
};
