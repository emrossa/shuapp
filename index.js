/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

/* MONGOOSE SETUP */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyDatabase');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    password: String
});
const UserInfo = mongoose.model('userInfo', userSchema, 'userInfo');

const teamSchema = new Schema({
    membername: String,
    memberjob: String
});
const TeamInfo = mongoose.model('teamInfo', teamSchema, 'teamInfo');


const attractionSchema = new Schema({
    attractionname: String,
    attractionprice: String
});
const AttractionInfo = mongoose.model('attractionInfo', attractionSchema, 'attractionInfo');

const locationSchema = new Schema({
    locationname: String,
    locationprice: String
});

const LocationInfo = mongoose.model('locationInfo', locationSchema, 'locationInfo');

const timingSchema = new Schema({
    hours: String,
    timeprice: String
});
const TimingInfo = mongoose.model('timingInfo', timingSchema, 'timingInfo');

/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        UserInfo.findOne({
            username: username
        }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.password != password) {
                return done(null, false);
            }
            
            return done(null, user);
        });
  }
));

app.post('/',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username);
});

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// people page 
app.get('/people', function(req, res) {
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

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));