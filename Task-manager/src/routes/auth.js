const express = require("express");
const router = new express.Router();
const User = require("../models/user");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create User
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ newUser: user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
