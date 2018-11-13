/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: 'shuapp', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  UserInfo.findOne({_id: id}, function(err, user) {
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
            username: username,
            password: password
        }, function(err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }
            
            return done(null, user);
        });
  }
));

function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login?error');
}

app.get('/login', function(req, res) {
    res.render('pages/login');
});

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login?invalid' }),
  function(req, res) {
    res.redirect('/booking');
});

// bookings page
app.get('/booking', requireAuth, function(req, res) {
      res.send('Hello booking page!');
      // TODO render booking page     
});

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// people page 
app.get('/people', function(req, res) {
    TeamInfo.find({}, function(err, people) {
        res.render('pages/people', {
            people: people
        });
    });
});

// location page 
app.get('/locations', function(req, res) {
    LocationInfo.find({}, function(err, location){
        res.render('pages/locations', {
            location: location
        });
    });
});
// attractions page 
app.get('/attractions', function(req, res) {
    AttractionInfo.find({}, function(err, attraction){
        res.render('pages/attractions', {
            attraction: attraction
        });
    });
});

// timings page 
app.get('/timings', function(req, res) {
    TimingInfo.find({}, function(err, timing){
        res.render('pages/timings', {
            timing: timing
        });
    });
});

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));