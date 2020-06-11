const express = require("express");
const path = require("path");

const app = express();

const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

app.get("", (req, res) => {
  res.send("Hello world");
});

app.get("/help", (req, res) => {
  res.send("Help page");
});

app.get("/about", (req, res) => {
  res.send("About");
});

app.get("/weather", (req, res) => {
  res.send({
    forecast: "Its snowing"
  });
});

app.listen(3000, () => {
  console.log("Server up on port 3000");
});
