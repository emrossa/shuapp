// models
const AttractionInfo = require('../models/attraction');
const LocationInfo = require('../models/location');
const TeamInfo = require('../models/team');
const TimingInfo = require('../models/timing');

// home page
module.exports.index = function (req, res) {
    res.render('pages/index');
};

// people page
module.exports.people = function (req, res) {
    TeamInfo.find({}, function (err, people) {
        res.render('pages/people', {
            people: people
        });
    });
};

// locations page
module.exports.locations = function (req, res) {
    LocationInfo.find({}, function (err, location) {
        res.render('pages/locations', {
            location: location
        });
    });
};

// attractions page 
module.exports.attractions = function (req, res) {
    AttractionInfo.find({}, function (err, attraction) {
        res.render('pages/attractions', {
            attraction: attraction
        });
    });
};

// timings page 
module.exports.timings = function (req, res) {
    TimingInfo.find({}, function (err, timing) {
        res.render('pages/timings', {
            timing: timing
        });
    });
};