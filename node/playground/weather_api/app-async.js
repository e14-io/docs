const yargs = require('yargs');
const axios = require('axios');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather',
      string: true
    }
  })
  .help()
  .alias('help','h')
  .argv;

let encodeAddress = encodeURIComponent(argv.address);
let geoCodeUrl = `http://maps.googleapis.com/maps/api/geocode/json?address=${encodeAddress}`;

async function getTemperature(geoUrl) {
  const geo = await axios.get(geoUrl);
  let lat = geo.data.results[0].geometry.location.lat;
  let lng = geo.data.results[0].geometry.location.lng;

  console.log(geo.data.results[0].formatted_address);

  let weatherUrl = `https://api.forecast.io/forecast/7ae78936ade432ee61aa7e170afbc9ca/${lat},${lng}`;
  const weather = await axios.get(weatherUrl);

  let temperature = weather.data.currently.temperature;
  let apparentTemperature = weather.data.currently.apparentTemperature;
  console.log(`Hay ${temperature} grados, sensacion termica: ${apparentTemperature} grados`);
}; 

getTemperature(geoCodeUrl);