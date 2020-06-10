const request = require("postman-request");

const mapToken =
  "pk.eyJ1IjoiZnJlZGR5bWFydGluZXoiLCJhIjoiY2tiOXE2ODBiMGduYzJ4bzFxeW93d29ucyJ9.4NIVhds4RA0j4eCLpha94Q";

const geocode = (address, callback) => {
  const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${mapToken}`;

  request(geocodeUrl, { json: true }, (err, response) => {
    if (err) {
      callback("Unable to connect to geo service", undefined);
    } else if (response.body.features.lenght == 0) {
      callback("Unable to find location", undefined);
    } else {
      const data = response.body.features;

      const latitude = data[0].center[1];
      const longitude = data[0].center[0];

      callback(undefined, {
        latitude,
        longitude,
        location: data[0].place_name
      });
    }
  });
};

module.exports = geocode;
