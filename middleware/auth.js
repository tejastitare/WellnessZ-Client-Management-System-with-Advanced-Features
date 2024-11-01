const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware for authenticating users based on JWT and roles
const auth = (roles = []) => {
    return async (req, res, next) => {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded JWT:", decoded);
            
            // Fetch the user from the database using the decoded userId
            const user = await User.findById(decoded.userId);

            // Check if user exists and if the role is permitted
            if (!user || (roles.length && !roles.includes(user.role))) {
                console.log("User role not permitted:", user?.role); // Use optional chaining for safety
                return res.status(403).json({ message: "Forbidden: Insufficient privileges" });
            }

            // Attach the user to the request object
            req.user = user;
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error("JWT verification error:", error);
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
    };
};

module.exports = auth;
