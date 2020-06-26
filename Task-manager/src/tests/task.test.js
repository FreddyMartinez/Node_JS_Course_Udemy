const request = require("supertest");
const app = require("../app");
const Task = require("../models/task");
const {
  defaultUser,
  secondUser,
  taskOne,
  setUpDatabase
} = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
    .send({
      description: "Test task"
    })
    .expect(200);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test("User should have two tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("Shold delete task ", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
    .send()
    .expect(200);

  const task = await Task.findById(taskOne._id);
  expect(task).toBeNull();
});

test("Shold not delete other users tasks ", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${secondUser.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
