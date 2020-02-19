const { app } = require('./app.js');
const request = require('supertest');

describe('/GET /location/portland', () => {
    test('It should respond with an object of the correct shape',
    // get the done function to call after the test
        async(done) => {
            // feed our express app to the supertest request
            const response = await request(app)
                // and hit out express app's about route with a /GET
                .get('/location/portland');
            // check to see if the response is what we expect
            expect(response.body).toEqual({
                formatted_query: '30 NW 10th Ave, Portland, OR 97209, USA',
                latitude: 45.5234211,
                longitude: -122.6809008
            });
            // it should have a status of 200
            expect(response.statusCode).toBe(200);
            // the callback has a 'done' that we can call to fix stuff :sparkle-emoji:
            done();
        });
});