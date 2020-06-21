const mongoose = require("mongoose");
const validator = require("validator");
const bcryptr = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Email not found");
  }

  const isMatch = await bcryptr.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Credentials error, unable to login");
  }

  return user;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "nodejsudemycourse");

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Hash the password before saving
userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcryptr.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;