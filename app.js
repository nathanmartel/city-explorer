const express = require('express');
const app = express();
const request = require('superagent');

const geoData = require('./data/geo.json');
const weatherData = require('./data/darksky.json');


app.get('/location', (req, res) => {

    // I assume this is where we'd process the given location from params, format appropriately, and call some function to provide lat and long?

    // res.json({
    //     formatted_query: 'Seattle, WA, USA',
    //     latitude: '47.606210',
    //     longitude: '-122.332071'
    // });

    // const reqLocation = req.params.locationParam;
    const filteredResult = geoData.results[0];

        
    res.json({
        formatted_query: filteredResult.formatted_address,
        latitude: filteredResult.geometry.location.lat,
        longitude: filteredResult.geometry.location.lng,
    });
});

app.get('/weather', (req, res) => {

    // I assume this is where we'd process the given location from params, format appropriately, and call some function to provide lat and long?

    res.json([
        {
            forecast: 'Partly cloudy until afternoon.',
            time: 'Mon Jan 01 2001'
        },
        {
            forecast: 'Mostly cloudy in the morning.',
            time: 'Tue Jan 02 2001'
        }
    ]);
});

app.get('*', (req, res) => {
    res.send('404 not found');
});

module.exports = { 
    app: app, 
};