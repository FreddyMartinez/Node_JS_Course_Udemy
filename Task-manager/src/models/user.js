const mongoose = require("mongoose");
const validator = require("validator");

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

module.exports = User;
