const express = require("express");
require("./db/mongoose");
const usersRouter = require("./routes/user");
const tasksRouter = require("./routes/task");
const authRouter = require("./routes/auth");

// configuring express
const app = express();

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);
app.use(authRouter);

module.exports = app;
