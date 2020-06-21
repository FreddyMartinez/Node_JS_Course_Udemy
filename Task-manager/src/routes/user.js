const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");

/**
 * User Endpoints
 */

// Get Users List
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(400).send();
    }
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get User by id
router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(400).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update User
router.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
