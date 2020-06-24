const mongoose = require("mongoose");

const connectionUrl = process.env.MONGO_URL;

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true
});
