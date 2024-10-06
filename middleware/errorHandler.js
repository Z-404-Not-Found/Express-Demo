const createError = require("http-errors");

const errorHandler = (err, req, res, next) => {
    if (createError.isHttpError(err)) {
        const status = err.status || 500;
        const response = {
            status,
            message: err.message,
        };
        res.status(status).json(response);
    } else {
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            timestamp: new Date().toLocaleString(),
            stack:
                process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }
};

module.exports = errorHandler;
