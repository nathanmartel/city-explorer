require('dotenv').config();
const express = require('express');
const app = express();
const request = require('superagent');
const cors = require('cors');

// const geoData = require('./data/geo.json');
// const weatherData = require('./data/darksky.json');


// Globalized for use in other functions/routes.
let lat;
let lng;


app.use(cors());

app.get('/', (req, res) => { res.send('Welcome!'); });

app.get('/location', async(req, res, next) => {
    try {
        const locationParam = req.query.search;
        const URL = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${locationParam}&format=json`;

        const locationReq = await request.get(URL);
        const locationData = locationReq.body[0];
        lat = locationData.lat;
        lng = locationData.lon;
        
        res.json({
            formatted_query: locationData.display_name,
            latitude: locationData.lat,
            longitude: locationData.lon,
        });
    }
    catch (err) {
        next(err);
    }
});


const getWeatherData = async(next) => {
    try {
        if (lat === undefined) { lat = 0; }
        if (lng === undefined) { lng = 0; }
        const URL = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/${lat},${lng}`;
        const weatherReq = await request.get(URL);
        const weatherData = weatherReq.body;

        return weatherData.daily.data.map(forecast => {
            return {
                forecast: forecast.summary,
                // Hot tip: Don't use Date, use moment library
                time: new Date(forecast.time * 1000),
                lat: lat,
                lng: lng,            
            };
        });
    }
    catch (err) {
        next(err);
    }
};

const getEventsData = async(next) => {
    try {
        if (lat === undefined) { lat = 0; }
        if (lng === undefined) { lng = 0; }
        const URL = `http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&location=${lat},${lng}&within=5&page_size=20&page_number=1`;
        const eventsReq = await request.get(URL);
        const eventsData = JSON.parse(eventsReq.text);
        
        return eventsData.events.event.map(event => {
            const startDateTimeArray = event.start_time.split(' ');
            return {
                name: event.title,
                link: event.url,
                event_date: startDateTimeArray[0],
                event_time: startDateTimeArray[1],
                lat: lat,
                lng: lng,
            };
        });
    }
    catch (err) {
        next(err);
    }
};

const getReviewsData = async(next) => {
    try {
        if (lat === undefined) { lat = 0; }
        if (lng === undefined) { lng = 0; }
        const URL = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lng}&limit=20`;
        const yelpReq = await request
            .get(URL)
            .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`);
        const yelpData = yelpReq.body;
        
        return yelpData.businesses.map(business => {
            return {
                name: business.name,
                image_url: business.image_url,
                price: business.price,
                rating: business.rating,
                url: business.url,
                lat: lat,
                lng: lng,
            };
        });
    }
    catch (err) {
        next(err);
    }
};

const getTrailsData = async(next) => {
    try {
        // Trails errors out on a lat,lng of 0,0 
        if (lat === undefined) { lat = 30; }
        if (lng === undefined) { lng = -95; }
        const URL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lng}&maxResults=10&key=${process.env.TRAILS_API_KEY}`;
        const trailsReq = await request
            .get(URL);
        const trailsData = trailsReq.body;
        
        return trailsData.trails.map(trail => {
            const conditionDateTimeArray = trail.conditionDate.split(' ');
            return {
                name: trail.name,
                location: trail.location,
                length: trail.length,
                stars: trail.stars,
                star_votes: trail.star_votes,
                summary: trail.summary,
                trail_url: trail.url,
                conditions: trail.conditionDetails,
                condition_date: conditionDateTimeArray[0],
                condition_time: conditionDateTimeArray[1],
                lat: lat,
                lng: lng,
            };
        });
    }
    catch (err) {
        next(err);
    }
};


app.get('/weather', async(req, res) => {
    const weatherData = await getWeatherData();
    res.json(weatherData);
});

app.get('/reviews', async(req, res) => {
    const reviewsData = await getReviewsData();
    res.json(reviewsData);
});

app.get('/trails', async(req, res) => {
    const trailsData = await getTrailsData();
    res.json(trailsData);
});

app.get('/events', async(req, res) => {
    const eventsData = await getEventsData();
    res.json(eventsData);
});

app.get('*', (req, res) => {
    res.statusCode = 404;
    res.send('404 not found');
});

module.exports = { 
    app: app, 
};