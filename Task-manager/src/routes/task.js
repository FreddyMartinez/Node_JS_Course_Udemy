const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

/**
 * Tasks Endpoints
 */

// Create a task
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

/**
 * Get list of task owned by one user
 * @filter      completed,
 * @pagination  limit, skip
 * @sorting     createdAt
 */
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed;
  }

  if (req.query.sortBy) {
    const sortingProp = req.query.sortBy.split(":");
    sort[sortingProp[0]] = sortingProp[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Find a specific task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  console.log(req.user);

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send("Task not found");
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a task
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["completed", "description"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Update" });
  }

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Delete Task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
