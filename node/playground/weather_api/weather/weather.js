const request = require('request');

const FORECAST_API_SECRET = '7ae78936ade432ee61aa7e170afbc9ca';

let fahrenheitToCelsius = (f) => {
  let c = ((+f - 32) / 1.8);
  return c.toFixed(1);
};

let getWeather = (lat, lng, callback) => {
  request({
    url: `https://api.forecast.io/forecast/${FORECAST_API_SECRET}/${lat},${lng}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('No se pudo conectar');
    } else if (!error && response.statusCode === 200) {
      callback(undefined, {
        temperature: fahrenheitToCelsius(body.currently.temperature),
        apparentTemperature: fahrenheitToCelsius(body.currently.apparentTemperature)
      });
    } else {
      callback('Hubo un error');
    }
  });
};

module.exports = {
  getWeather
};