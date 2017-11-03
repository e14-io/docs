const request = require('request');

var geocodeAddress = (address, callback) => {
  let qs = encodeURIComponent(address);

  request({
    url: `http://maps.googleapis.com/maps/api/geocode/json?address=${qs}`,
    json: true
  }, (error, response, body) => {
    if (error) {
      callback('No se pudo conectar con el servidor');
    } else if (body.status === 'ZERO_RESULTS') {
      callback('No hay dirección que coincida');
    } else if (body.status === 'OK') {
      callback(undefined, {
        address: body.results[0].formatted_address,
        latitude: body.results[0].geometry.location.lat,
        longitude: body.results[0].geometry.location.lng
      });
    };
  });
};

module.exports = {
  geocodeAddress
};