const request = require("postman-request");

const apiKey = "5896c0da3652eb6db56b0c36f6a496bb";

const forecast = (latitude, longitud, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${latitude},${longitud}&units=m`;

  request(url, { json: true }, (error, response) => {
    if (error) {
      callback("Unable to connect to weather service", undefined);
    } else if (response.body.error) {
      callback("Unable to find this location", undefined);
    } else {
      const location = response.body.location;
      const weather = response.body.current;
      callback(
        undefined,
        `La temperatura en ${location.name} es ${weather.temperature} C.`
      );
    }
  });
};

module.exports = forecast;
