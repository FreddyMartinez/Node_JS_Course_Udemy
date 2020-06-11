const geocode = require("./util/geocode");
const forecast = require("./util/weather");

const city = process.argv[2];

geocode(city, (error, data) => {
  if (error) console.log("Error: ", error);
  else {
    console.log(data);

    forecast(data.latitude, data.longitude, (error, data) => {
      console.log("Error: ", error);
      console.log("Data: ", data);
    });
  }
});
