/*  EXPRESS SETUP  */

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

// models
const UserInfo = require('./models/user');

// routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const bookingsRouter = require('./routes/bookings');

// set the view engine to ejs
app.set('view engine', 'ejs');

// load validator
app.use(require('express-validator')());

// body parser
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

// require authentication for certain routes
function requireAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/auth/login?error');
}

// use routers
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/bookings', requireAuth, bookingsRouter);

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('App listening on port ' + port));