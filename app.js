const express = require("express");
const logger = require("morgan");
const errorHandler = require("./middleware/errorHandler");

const usersRouter = require("./routes/userRoutes");
const uploadRouter = require("./routes/uploadRouters");
const updateRouter = require("./routes/updateRoutes");

const app = express();

app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", usersRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/update", updateRouter);

app.use(errorHandler);

module.exports = app;
