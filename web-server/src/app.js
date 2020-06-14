const express = require("express");
const path = require("path");
const hbs = require("hbs");
const geocode = require("./util/geocode");
const forecast = require("./util/weather");

const app = express();
const port = process.env.PORT || 3000;

// Paths
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars
app.use(express.static(publicPath));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("", (req, res) => {
  res.render("index");
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "How can I help you?"
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/weather", (req, res) => {
  if (!req.query.city) {
    return res.send({
      error: "you must provide a city"
    });
  }

  const city = req.query.city;

  geocode(city, (error, { latitude, longitude }) => {
    if (error) console.log("Error: ", error);
    else {
      forecast(latitude, longitude, (error, data) => {
        if (error) console.log("Error: ", error);
        res.send(data);
      });
    }
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMessage: "Help article not found"
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    errorMessage: "Page not found"
  });
});

app.listen(port, () => {
  console.log("Server up on port 3000");
});
