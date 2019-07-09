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
  } catch (exception) {
    response.status(400).send('It did not work');
  }

});

const returnLocation = (locationName) => {

  const locationData = require('./data/geo.json');
  const location = {
    search_query: locationName,
    formatted_query: locationData.results[0].formatted_address,
    latitude: locationData.results[0].geometry.location.lat,
    longitude: locationData.results[0].geometry.location.lng
  }
  return location;

};
app.listen(PORT, () => {
  console.log('It worked!');
});

