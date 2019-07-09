'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.get('/location', (request, response) => {
  console.log('Location data: ', request.query.data);
  try {
    const loc = returnLocation(request.query.data);
    response.status(200).send(loc);
  } catch (err) {
    response.status(500).send('Sorry, something went wrong with /location');
  }

});

app.get('/weather', (request, response) => {
  console.log('Weather data: ', request.query.data);
  try {
    const weather = returnWeather(request.query.data);
    response.status(200).send(weather);
  } catch (err) {
    response.status(500).send('Sorry, something went wrong with /weather');
  }
});

app.use('*', (request, response) => {
  response.status(500).send('Sorry, something went wrong');
});

const returnLocation = (locationName) => {

  const locationData = require('./data/geo.json');

  function Location(search_query, formatted_query, latitude, longitude) {
    this.search_query = search_query;
    this.formatted_query = formatted_query;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  const search_query = locationName;
  const formatted_query = locationData.results[0].formatted_address;
  const latitude = locationData.results[0].geometry.location.lat;
  const longitude = locationData.results[0].geometry.location.lng;

  return new Location(search_query, formatted_query, latitude, longitude);

};

const returnWeather = (location) => {
  const weatherData = require('./data/darksky.json');
  let weatherArray = [];

  function Weather(forecast, time) {
    this.forecast = forecast;
    this.time = time;
  }

  let forecast = '';
  let time = '';
  for (let i = 0; i < weatherData.daily.data.length; i++) {
    forecast = weatherData.daily.data[i].summary;
    time = new Date(weatherData.daily.data[i].time);
    weatherArray.push(new Weather(forecast, time.toDateString()));
  }

  return weatherArray;

};
app.listen(PORT, () => {
  console.log('It worked!');
});

