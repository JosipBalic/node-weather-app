//import installed request npm module (simplified HTTP request module)
const request = require('request');

//create main forecast function for weather stack that will return needed data
const forecastWeatherStack = (latitude, longitude, callback) => {
  //create calling url to get forecast data, api key is read from config file
  const url =
    'http://api.weatherstack.com/current?access_key=' +
    process.env.WEATHER_FORECAST_API +
    '&query=' +
    latitude +
    ',' +
    longitude;

  // here we create a request by passing url, defining communication type and upon getting response we are getting either an error or a succ body
  request({ url, json: true }, (error, { body }) => {
    // if we get an error, return error first and then null data as second parameter

    if (error) {
      callback('Unable to connect to weather service!', undefined);
      // if we didnt get any data back, return user specified error
    } else if (body.error) {
      callback('Unable to find location!', undefined);
      /*         
        if everything is good, return parsed data as
            1. weather_description
            2. current temperature
            3. feels like temperature 
*/
    } else {
      callback(undefined, {
        weather_descriptions: body.current.weather_descriptions[0],
        temperature: body.current.temperature,
        feels_like: body.current.feels_like,
      });
    }
  });
};

//create second forecast function for open weather that will return needed data
const forecastOpenWeather = (latitude, longitude, callback) => {
  //create calling url to get forecast data, app id is read from input config file
  const url =
    'http://api.openweathermap.org/data/2.5/weather?lat=' +
    latitude +
    '&lon=' +
    longitude +
    '&APPID=' +
    process.env.OPEN_WEATHER_APP_ID;

  // here we create a request by passing url, defining communication type and upon getting response we are getting either an error or a succ body
  request({ url, json: true }, (error, { body }) => {
    // if we get an error, return error first and then null data as second parameter

    if (error) {
      callback('Unable to connect to weather service!', undefined);
      // if we didnt get any data back, return user specified error
    } else if (body.error) {
      callback('Unable to find location!', undefined);
    } else {
      callback(undefined, {
        weather_descriptions: body.weather[0].description,
        temperature: body.main.temp,
        feels_like: body.main.feels_like,
      });
    }
  });
};

// finally export custom made forecast functions
module.exports = {
  forecastWeatherStack: forecastWeatherStack,
  forecastOpenWeather: forecastOpenWeather,
};
