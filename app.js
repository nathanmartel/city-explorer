const express = require('express');

const app = express();

app.get('/blah', (req, res) => {
    res.json({
        some: 'json',
    });
});

app.get('*', (req, res) => {
    res.json({
        ohno: '404 not found',
    });
});

app.listen(3000, () => { console.log('running...'); });
