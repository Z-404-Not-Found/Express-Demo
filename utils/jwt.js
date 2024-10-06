const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

const jwtUtils = {
    generateToken: (payload, expiresIn = "1h") => {
        return jwt.sign(payload, jwtSecret, { expiresIn });
    },
    verifyToken: (token) => {
        try {
            return jwt.verify(token, jwtSecret);
        } catch (error) {
            throw new Error("Invalid token");
        }
    },
};

module.exports = jwtUtils;
