const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { defaultUser, defaultUserId, setUpDatabase } = require("./fixtures/db");

beforeEach(setUpDatabase);

test("Should signup a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Pingüino",
      email: "fhmartinezq@unal.edu.co",
      password: "pollitopass",
      age: 26
    })
    .expect(201);

  // Asset that the user exists in db
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Inspect the response
  expect(response.body).toMatchObject({
    user: {
      name: "Pingüino",
      email: "fhmartinezq@unal.edu.co"
    },
    token: user.tokens[0].token
  });
});

test("Should login successfully", async () => {
  const response = await request(app)
    .post("/login")
    .send({
      email: defaultUser.email,
      password: defaultUser.password
    })
    .expect(200);

  // Verify the token
  const user = await User.findById(defaultUserId);
  expect(response.body.token).toBe(user.tokens[0].token);
});

test("Should fail to login", async () => {
  await request(app)
    .post("/login")
    .send({
      email: defaultUser.email,
      password: "failpass"
    })
    .expect(400);
});

test("Should get users list", async () => {
  await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should fail when trying to get users list", async () => {
  await request(app)
    .get("/users")
    .send()
    .expect(500);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
    .attach("avatar", "./src/tests/fixtures/fox.jpg")
    .expect(200);

  const user = await User.findById(defaultUserId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should delete user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${defaultUser.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(defaultUserId);
  expect(user).toBeNull();
});
