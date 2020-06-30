const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const generateMessage = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require("./utils/users");

// Seting up server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPaht = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPaht));

// Establishing connection
io.on("connection", socket => {
  // Someone joins a room
  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      callback(error);
    }

    socket.join(room);

    socket.emit("message", generateMessage("App", "Welcome!"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage("App", `${username} has joined`));

    io.to(room).emit("roomData", {
      room,
      users: getUsersInRoom(room)
    });
    callback();
  });

  // Someone send a message
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback("Profanity is not allowed");
    }

    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });

  // Someone send their location
  socket.on("sendLocation", (location, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateMessage(
        user.username,
        `https://www.google.com/maps/@${location.latitude},${location.longitude}`
      )
    );
    callback("Location shared");
  });

  // Someone is desconected
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("App", `${user.username} has left the room`)
      );

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
