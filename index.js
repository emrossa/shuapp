/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// load validator
app.use(require('express-validator')());

// body parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const async = require('async');

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

// flash messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.success_message = req.flash('success_message');
    next();
});

/* MONGOOSE SETUP */

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyDatabase');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    email: String,
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
    async.parallel({
        team:        function(cb) { TeamInfo.find({}).exec(cb); },
        locations:   function(cb) { LocationInfo.find({}).exec(cb); },
        attractions: function(cb) { AttractionInfo.find({}).exec(cb); },
        timings:     function(cb) { TimingInfo.find({}).exec(cb); }
    }, function (err, result) {
        res.render('pages/booking', result);
    });
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

app.get('/register', function(req, res) {
    res.render('pages/register');
});
///////
function createUser(newUser, callback) {
    newUser.save(callback);
}

app.post('/register', function(req, res){
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let cfm_pwd = req.body.cfm_pwd;
  
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Please enter a valid email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cfm_pwd', 'Confirm Password is required').notEmpty();
    req.checkBody('cfm_pwd', 'Confirm Password Must Matches With Password').equals(password);
  
    let errors = req.validationErrors();
    if (errors) {
        res.render('pages/register', {errors: errors});
    } else {
        let user = new UserInfo({
            username: username,
            email: email,
            password: password
        });
        createUser(user, function(err, user) {
            if (err) throw err;
            else console.log(user);
        });
        req.flash('success_message','You have registered, Now please login');
        res.redirect('login');
    }
  });

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));