const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail } = require("../emails/account");

// Create User
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    sendWelcomeEmail(user.email, user.name);
    res.status(201).send({ newUser: user, token });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login
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

// Logout
router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );

    await req.user.save();

    res.send();
  } catch (error) {}
});

// Logout from all sessions
router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send("Successfully logged out from all sessions");
  } catch (error) {}
});

module.exports = router;
