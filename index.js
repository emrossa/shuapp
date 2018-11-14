/*  EXPRESS SETUP  */

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');

// models
const AttractionInfo = require('./models/attraction');
const BookingInfo = require('./models/booking');
const LocationInfo = require('./models/location');
const TeamInfo = require('./models/team');
const TimingInfo = require('./models/timing');
const UserInfo = require('./models/user');

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
  UserInfo.findById(id, function(err, user) {
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

/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        // look up user by username
        UserInfo.findOne({username: username}, function(err, user) {
            if (err) {
                return done(err);
            }

            // no user with that username
            if (!user) {
                return done(null, false);
            }

            // compare password with hash
            bcrypt.compare(password, user.password, function (err, isMatch) {
                if (err) {
                    return done(err);
                }

                // password is incorrect
                if (!isMatch) {
                    return done(null, false);
                }

                // success!
                return done(null, user);
            });
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
    res.render('pages/login', {
        error: req.flash('error')
    });
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.'
}), function(req, res) {
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
        result.booking_error = req.flash('booking_error'); // if we had any validation errors
        res.render('pages/bookings/new', result);
    });
});

app.post('/booking', requireAuth, function (req, res) {
    req.checkBody('team', 'At least one staff member is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        errors.forEach(function (error) {
            req.flash('booking_error', error.msg);
        });
        return res.redirect('/booking');
    }

    let booking = new BookingInfo(req.body);
    booking.user = req.user._id;
    booking.bookedOn = Date.now();
    booking.save(function () {
        req.flash('success_message','Your booking has been created!');
        res.redirect('/booking');
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
// bookings page 
app.get('/bookings', requireAuth, function(req, res) {
    BookingInfo.find({user: req.user._id}, function (err, bookings) {
        res.render('pages/bookings/list', {
            bookings: bookings
        });
    });
});

app.get('/bookings/:id', requireAuth, function(req, res) {
    BookingInfo.findOne({user: req.user._id, _id: req.params.id}, function (err, booking) {
        if (booking) {
            async.parallel({
                team:        function(cb) { TeamInfo.find({_id: {$in: booking.team}}).exec(cb); },
                location:    function(cb) { LocationInfo.findById(booking.location).exec(cb); },
                attractions: function(cb) { AttractionInfo.find({_id: {$in: booking.attractions}}).exec(cb); },
                timing:      function(cb) { TimingInfo.findById(booking.timing).exec(cb); }
            }, function (err, result) {
                result.booking = booking;
                res.render('pages/bookings/view', result);
            });
        } else {
            res.render('pages/bookings/notfound');
        }
    });
});
//booking deletion

app.get('/bookings/:id/delete', requireAuth, function(req, res) {
    BookingInfo.findOne({user: req.user._id, _id: req.params.id}, function (err, booking) {
        if (booking) {
            booking.remove(function (err) {
                req.flash('success_message','Your booking has been deleted');
                res.redirect('/bookings');
            });
        } else {
            res.render('pages/bookings/notfound');
        }
    });
});

app.get('/register', function(req, res) {
    res.render('pages/register');
});

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
        UserInfo.createUser(user, function(err, user) {
            if (err) throw err;

            req.flash('success_message','You have registered, Now please login');
            res.redirect('login');
        });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));