const mongoose = require("mongoose");

const connectionUrl = process.env.MONGO_URL;

const databaseName = "task-manager";

mongoose.connect(connectionUrl + "/" + databaseName, {
  useNewUrlParser: true,
  useCreateIndex: true
});
