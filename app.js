const express = require('express');
const app = express();
const request = require('superagent');
const cors = require('cors');

const geoData = require('./data/geo.json');
const weatherData = require('./data/darksky.json');


// Globalized for use in other functions/routes.
let lat;
let lng;


app.use(cors());

app.get('/', (req, res) => { res.send('Welome!'); });

app.get('/location', (req, res) => {

    // i.e. www.google.com/?search=abc
    const location = request.query.search;

    // I assume this is where we'd process the given location from params, format appropriately, and call some function to provide lat and long?

    // const reqLocation = req.params.locationParam;
    const filteredResult = geoData.results[0];
    lat = filteredResult.geometry.location.lat;
    lng = filteredResult.geometry.location.lng;
    
    res.json({
        formatted_query: filteredResult.formatted_address,
        latitude: filteredResult.geometry.location.lat,
        longitude: filteredResult.geometry.location.lng,
    });
});

const getWeatherData = (lat, lng) => {
    return weatherData.daily.data.map(forecast => {
        return {
            forecast: forecast.summary,
            // Hot tip: Don't use Date, use moment library
            time: new Date(forecast.time * 1000),            
        };
    });
};

app.get('/weather', (req, res) => {

    const filteredResult = getWeatherData(lat, lng);

    res.json(filteredResult);
});

app.get('*', (req, res) => {
    res.send('404 not found');
});

module.exports = { 
    app: app, 
};