const geocode = require("./util/geocode");
const forecast = require("./util/weather");

geocode("Medellin", (error, data) => {
  if (error) console.log("Error: ", error);
  else {
    console.log(data);

    forecast(data.latitude, data.longitude, (error, data) => {
      console.log("Error: ", error);
      console.log("Data: ", data);
    });
  }
});
