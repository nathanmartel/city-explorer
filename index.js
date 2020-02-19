// import { app } from './server.js';
const { app } = require('./app.js');
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
    console.log('server running on port', port);
});