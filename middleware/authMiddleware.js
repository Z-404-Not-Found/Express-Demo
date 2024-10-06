const jwtUtils = require("../utils/jwt");
const createError = require("http-errors");

const authMiddleware =
    (roles = []) =>
    (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(createError(401, { message: "未授权" }));
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwtUtils.verifyToken(token);
            if (roles.length && !roles.includes(decoded.role)) {
                return next(createError(403, { message: "权限不足" }));
            }
            req.auth = decoded;
            next();
        } catch (err) {
            next(createError(401, { message: "无效的令牌" }));
        }
    };

module.exports = authMiddleware;
