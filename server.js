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

// index page 
app.get('/', function(req, res) {
    var people = [
        { name: 'Tom Adams', job: 3 },
        { name: 'Chris Smith', job: 5 },
        { name: 'Amy White', job: 3}
    ];
    var tagline = ".";

    res.render('pages/index', {
        people: people,
        tagline: tagline
    });
});
});

// people page 
app.get('/people', function(req, res) {
    res.render('pages/people');
});

app.listen(8080);
console.log('8080 is the magic port');