const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/user");
const Task = require("../../models/task");

const defaultUserId = new mongoose.Types.ObjectId();
const defaultUser = {
  _id: defaultUserId,
  name: "Pollito",
  email: "cfalsofredy@gmail.com",
  password: "pollitopass",
  age: 26,
  tokens: [
    {
      token: jwt.sign({ _id: defaultUserId }, process.env.JWT_SECRET)
    }
  ]
};

const secondUserId = new mongoose.Types.ObjectId();
const secondUser = {
  _id: secondUserId,
  name: "Pingüino",
  email: "fhmartinezq@gmail.com",
  password: "pingupass",
  age: 26,
  tokens: [
    {
      token: jwt.sign({ _id: secondUserId }, process.env.JWT_SECRET)
    }
  ]
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First test task",
  owner: defaultUser._id
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second test task",
  owner: defaultUser._id
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await User(defaultUser).save();
  await User(secondUser).save();
  await Task(taskOne).save();
  await Task(taskTwo).save();
};

module.exports = {
  defaultUser,
  defaultUserId,
  secondUser,
  secondUserId,
  setUpDatabase,
  taskOne
};
