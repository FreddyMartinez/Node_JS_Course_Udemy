const mongoose = require("mongoose");
const validator = require("validator");

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

mongoose.connect(connectionUrl + "/" + databaseName, {
  useNewUrlParser: true,
  useCreateIndex: true
});

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: value => {
        return validator.isEmail(value);
      },
      message: props => `${props.value} is not a valid email`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate: {
      validator: value => {
        return !value.toLowerCase().includes("password");
      },
      message: () => `Password can not contain password`
    }
  },
  age: {
    type: Number,
    validate: {
      validator: value => {
        return value > 0;
      },
      message: () => `Age must be a positive number`
    }
  }
});

const testUser = new User({
  name: "Andrea",
  email: "andreamail@gmail.com",
  password: "Password123",
  age: 23
});

testUser
  .save()
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });
