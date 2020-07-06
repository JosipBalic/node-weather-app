// import data from additional add ons
const express = require('express');
const path = require('path');
const hbs = require('hbs');

// import custom made functions
const geocode = require('./utils/geocode');

// import functions from forecast
const {
  forecastWeatherStack,
  forecastOpenWeather,
} = require('./utils/forecast');

// raise and start our server
const app = express();

// get application port from config file
const port = process.env.PORT;

// define PATHs for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// setup static directory to serve on server
app.use(express.static(publicDirectoryPath));

// define main index page
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Test User',
  });
});

// define about page
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'Weather',
    name: 'Test User',
  });
});

// define help page
app.get('/help', (req, res) => {
  res.render('help', {
    message: 'This is some helpful text.',
    title: 'Help',
    name: 'Test User',
  });
});

// get all the data on submit button
app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an location!',
    });
  }

  // get place location data (latitude, longitude)
  geocode(
    req.query.address,
    (error, { latitude, longitude, location_name } = {}) => {
      if (error) {
        return res.send({ error });
      }

      // make local variables for all forecast data
      var location = location_name;
      var address = req.query.address;
      var weather_stack;
      var open_weather;

      // get data from weather stack
      forecastWeatherStack(
        latitude,
        longitude,
        (error, forecastData) => {
          if (error) {
            return res.send({ error });
          }

          // prepare weather stack data
          weather_stack =
            forecastData.weather_descriptions +
            ' with ' +
            forecastData.temperature;

          // if we have all data send it to web page
          if (weather_stack && open_weather) {
            res.send({
              location: location_name,
              address: req.query.address,
              weather_stack: weather_stack,
              open_weather: open_weather,
            });
          }
        },
      );

      // get forecast data from open weather
      forecastOpenWeather(
        latitude,
        longitude,
        (error, forecastData) => {
          if (error) {
            return res.send({ error });
          }

          // prepare open weather data
          open_weather =
            forecastData.weather_descriptions +
            ' with ' +
            forecastData.temperature;

          // if we have all data send it to web page
          if (weather_stack && open_weather) {
            res.send({
              location: location_name,
              address: req.query.address,
              weather_stack: weather_stack,
              open_weather: open_weather,
            });
          }
        },
      );
    },
  );
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }

  res.send({
    products: [],
  });
});

// define help page
app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Test User',
    errorMessage: 'Help article not found.',
  });
});

// define error page
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Test User',
    errorMessage: 'Page not found.',
  });
});

// define server on specific port
app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
