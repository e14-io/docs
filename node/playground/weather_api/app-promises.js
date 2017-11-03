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

axios.get(geoCodeUrl).then((response) => {
  if (response.data.status === 'ZERO_RESULTS') {
    throw new Error('Dirección no encontrada');
  }

  let lat = response.data.results[0].geometry.location.lat;
  let lng = response.data.results[0].geometry.location.lng;
  let weatherUrl = `https://api.forecast.io/forecast/7ae78936ade432ee61aa7e170afbc9ca/${lat},${lng}`;
  console.log(response.data.results[0].formatted_address);
  return axios.get(weatherUrl);
}).then((response) => {
  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  console.log(`Hay ${temperature} grados, sensacion termica: ${apparentTemperature} grados`);
}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('Hubo un error');
  } else {
    console.log(e.message)
  }
});