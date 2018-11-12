// server.js
// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');

    // server.js

// people page 
app.get('/', function(req, res) {
    var team = [
        { name: 'Tom Adams', job: 3 },
        { name: 'Chris Smith', job: 5 },
        { name: 'Amy White', job: 3}
    ];
    var tagline = "Our fabulous team!";

    res.render('pages/people', {
        team: team,
        tagline: tagline
    });
});
});

// people page 
app.get('/people', function(req, res) {
    res.render('pages/people');
});

// location page 
app.get('/locations', function(req, res) {
    res.render('pages/locations');
});

// attractions page 
app.get('/attractions', function(req, res) {
    res.render('pages/attractions');
});

// timings page 
app.get('/timings', function(req, res) {
    res.render('pages/timings');
});
app.listen(8080);
console.log('8080 is the magic port');