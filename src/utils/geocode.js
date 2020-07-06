//import installed request npm module (simplified HTTP request module)
const request = require('request');

//create main geocode function that will return longitude, latitude and location
const geocode = (address, callback) => {
  //create calling url to get geocode locations and limit the response status to 1
  const url =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    address +
    '.json?access_token=' +
    process.env.GEOCODE_API +
    '&limit=1';

  // here we create a request by passing url, defining communication type and upon getting response we are getting either an error or a succ body
  request({ url, json: true }, (error, { body }) => {
    // if we get an error, return error first and then null data as second parameter
    if (error) {
      callback('Unable to connect to location services!', undefined);
      // if we didnt get any data back, return user specified error
    } else if (body.features.length === 0) {
      callback(
        'Unable to find location. Try another search.',
        undefined,
      );
      /*         
        if everything is good, return parsed data as
            1. latitude
            2. longitude
            3. location_name 
*/
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location_name: body.features[0].place_name,
      });
    }
  });
};

// finally export custom made geocode function
module.exports = geocode;
