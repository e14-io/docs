const yargs = require('yargs');

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

geocode.geocodeAddress(argv.a, (error, res) => {
  if (error) {
    console.log(error);
  } else {
    console.log(res.address);
    weather.getWeather(res.latitude, res.longitude, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Hay ${results.temperature} grados, sensacion termica: ${results.apparentTemperature} grados`);
      }
    });
  }
});