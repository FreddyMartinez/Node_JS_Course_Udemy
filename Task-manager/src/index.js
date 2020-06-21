const express = require("express");
require("./db/mongoose");
const usersRouter = require("./routes/user");
const tasksRouter = require("./routes/task");
const authRouter = require("./routes/auth");

// configuring express
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(usersRouter);
app.use(tasksRouter);
app.use(authRouter);

// Initialize the server
app.listen(port, () => {
  console.log("App listening on port " + port);
});
