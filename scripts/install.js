const async = require('async');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyDatabase');

const models = {
    AttractionInfo: require('../models/attraction'),
    LocationInfo: require('../models/location'),
    TeamInfo: require('../models/team'),
    TimingInfo: require('../models/timing')
};

const fixtures = {
    AttractionInfo: [
        {attractionname: 'Lights', attractionprice: 1500},
        {attractionname: 'Smoke', attractionprice: 300},
        {attractionname: 'Balloons', attractionprice: 300},
        {attractionname: 'Confetti', attractionprice: 90},
        {attractionname: 'Guitar', attractionprice: 550},
        {attractionname: 'Harp', attractionprice: 650},
        {attractionname: 'Percussion', attractionprice: 750}
    ],
    LocationInfo: [
        {locationname: 'Cosy Room', locationprice: 2000},
        {locationname: 'Gold Room', locationprice: 3500},
        {locationname: 'Ballroom', locationprice: 5000}
    ],
    TeamInfo: [
        {membername: 'Tom Adams', memberjob: 'DJ', memberprice: 1500},
        {membername: 'Chris Smith', memberjob: 'Master of ceremonies', memberprice: 1500},
        {membername: 'Emma White', memberjob: 'Singer', memberprice: 1000}
    ],
    TimingInfo: [
        {hours: 'Standard 8h', timeprice: 0},
        {hours: 'Premium 12h', timeprice: 800}
    ]
};

// loop over the fixture data
async.forEachOf(fixtures, function (modelFixtures, modelName, modelCallback) {
    // remove all entries for model name
    models[modelName].deleteMany({}, function (err) {
        if (err) return modelCallback(err);

        // now populate with all the fixtures
        async.forEach(modelFixtures, function (object, fixtureCallback) {
            let fixture = new models[modelName](object);
            fixture.save(fixtureCallback);
        }, modelCallback);
    });
}, function (err) {
    if (err) console.log(err);
    mongoose.connection.close();
});