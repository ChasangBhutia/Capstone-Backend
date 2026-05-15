const jwt = require("jsonwebtoken");

module.exports.authMiddleware = (req, res, next) => {
    let token = req.cookies.token;

    // Check for token in Authorization header if not in cookies
    if (!token && req.headers.authorization) {
        if (req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else {
            token = req.headers.authorization;
        }
    }

    console.log("Token received:", token ? "Token present" : "No token");

    if (!token) {
        console.log("No token found");
        return res.status(401).json({ success:false, error: "Unauthorized: No token provided" });
    }
    try {
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = decodedUser;
        console.log("Token verified. User:", decodedUser.email);

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
