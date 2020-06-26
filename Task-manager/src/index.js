const app = require("./app");

const port = process.env.PORT || 3000;

// Initialize the server
app.listen(port, () => {
  console.log("App listening on port " + port);
});
