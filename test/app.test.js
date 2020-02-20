const { app } = require('../app.js');
const request = require('supertest');


describe('/GET /location/?search=portland', () => {
    test('It should respond with an object of the correct shape',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/location/?search=portland');
            // check to see if the response is what we expect
            expect(response.body).toEqual({
                formatted_query: 'Portland, Multnomah County, Oregon, USA',
                latitude: '45.5202471',
                longitude: '-122.6741949'
            });
            // it should have a status of 200
            expect(response.statusCode).toBe(200);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });
});

describe('/GET /trails', () => {
    test('It should respond with an object of the correct shape',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/trails');
            // check to see if the response is what we expect
            expect(response.body[0]).toEqual({
                name: 'Wildwood Trail - National Recreation Trail',
                location: 'West Haven-Sylvan, Oregon',
                length: 29.4,
                stars: 4.5,
                summary: 'A 30-mile rolling singletrack trail through America\'s largest forested urban park.',
                trail_url: 'https://www.hikingproject.com/trail/7001822/wildwood-trail-national-recreation-trail',
                conditions: null,
                condition_date: '1970-01-01',
                condition_time: '00:00:00',
                lat: '45.5202471',
                lng: '-122.6741949'            
            });
            // it should have a status of 200
            expect(response.statusCode).toBe(200);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });
});

describe('/GET bad link of /asdf', () => {
    test('It should respond with a 404 error',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/asdf');
            // check to see if the response is what we expect
            expect(response.text).toEqual('404 not found');
            // it should have a status of 200
            expect(response.statusCode).toBe(404);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });
});