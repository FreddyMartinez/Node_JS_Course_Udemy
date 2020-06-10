const request = require("postman-request");

const apiKey = "5896c0da3652eb6db56b0c36f6a496bb";
const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=Medellin&units=m`;

request(url, { json: true }, (error, response) => {
  if (error) {
    console.log("Unable to connect to weather service");
  } else if (response.body.error) {
    console.log("Unable to find this location");
  } else {
    const location = response.body.location;
    const weather = response.body.current;
    console.log(
      `La temperatura en ${location.name} is ${weather.temperature} C.`
    );
  }
});

console.log("probando si es sincrono");

////////////////////

const city = "Bogota";
const mapToken =
  "pk.eyJ1IjoiZnJlZGR5bWFydGluZXoiLCJhIjoiY2tiOXE2ODBiMGduYzJ4bzFxeW93d29ucyJ9.4NIVhds4RA0j4eCLpha94Q";
const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=${mapToken}`;

request(geocodeUrl, { json: true }, (err, response) => {
  if (err) {
    console.log("Unable to connect to weather service");
  } else if (response.body.features.lenght == 0) {
    console.log("Unable to find location");
  } else {
    const data = response.body.features;

    const latitude = data[0].center[1];
    const longitude = data[0].center[0];

    console.log(`${city} latitude: ${latitude} and longitud: ${longitude}`);
  }
});

console.log("probando si es sincrono de nuevo");
