const async = require('async');

const TeamInfo = require('../models/team');
const LocationInfo = require('../models/location');
const AttractionInfo = require('../models/attraction');
const TimingInfo = require('../models/timing');
const BookingInfo = require('../models/booking');

function getBookingInfo(booking, callback) {
    // look up other info about the booking
    async.parallel({
        team:        function(cb) { TeamInfo.find({_id: {$in: booking.team}}).exec(cb); },
        location:    function(cb) { LocationInfo.findById(booking.location).exec(cb); },
        attractions: function(cb) { AttractionInfo.find({_id: {$in: booking.attractions}}).exec(cb); },
        timing:      function(cb) { TimingInfo.findById(booking.timing).exec(cb); }
    }, callback);   
}

// form to create new booking
module.exports.new = function(req, res) {
    // look up all the available info for a booking
    async.parallel({
        team:        function(cb) { TeamInfo.find({}).exec(cb); },
        locations:   function(cb) { LocationInfo.find({}).exec(cb); },
        attractions: function(cb) { AttractionInfo.find({}).exec(cb); },
        timings:     function(cb) { TimingInfo.find({}).exec(cb); }
    }, function (err, result) {
        result.booking_error = req.flash('booking_error'); // if we had any validation errors from create
        res.render('pages/bookings/new', result);
    });
};

// save the new booking in the database
module.exports.create = function (req, res) {
    // check for other bookings on the same date (for any user)
    BookingInfo.findOne({bookedFor: new Date(req.body.bookedFor)}, function (err, existingBooking) {
        req.checkBody('team', 'At least one staff member is required').notEmpty();
        req.checkBody('bookedFor', 'Must book for a valid date').notEmpty();
        req.checkBody('bookedFor', 'Must book for a date in the future').toDate().custom(function (date) {
            return (date && date > new Date());
        });
        req.checkBody('bookedFor', 'This date has already been booked').custom(function (date) {
            return !existingBooking; // fail validation if booking already exists
        });
    
        let errors = req.validationErrors();
        if (errors) {
            errors.forEach(function (error) {
                req.flash('booking_error', error.msg);
            });
            return res.redirect('/bookings/new');
        }
    
        // get other info to work out cost
        getBookingInfo(req.body, function (err, info) {
            let cost = info.location.locationprice + info.timing.timeprice;

            info.team.forEach(function (member) {
                cost += member.memberprice;
            });

            info.attractions.forEach(function (attraction) {
                cost += attraction.attractionprice;
            });

            // create the booking
            let booking = new BookingInfo(req.body);
            booking.user = req.user._id;
            booking.bookedOn = Date.now();
            booking.totalPrice = cost;
            booking.save(function () {
                req.flash('success_message','Your booking has been created!');
                res.redirect('/bookings/new');
            });
        });
    });
};

// my bookings index 
module.exports.index = function(req, res) {
    BookingInfo.find({user: req.user._id}, function (err, bookings) {
        res.render('pages/bookings/list', {
            bookings: bookings
        });
    });
};

// show single booking
module.exports.show = function(req, res) {
    BookingInfo.findOne({user: req.user._id, _id: req.params.id}, function (err, booking) {
        if (booking) {
            getBookingInfo(booking, function (err, result) {
                result.booking = booking;
                res.render('pages/bookings/view', result);
            });
        } else {
            res.render('pages/bookings/notfound');
        }
    });
};


// booking deletion
module.exports.delete = function(req, res) {
    BookingInfo.findOne({user: req.user._id, _id: req.params.id}, function (err, booking) {
        if (booking) {
            // delete the booking if it exists
            booking.remove(function (err) {
                req.flash('success_message','Your booking has been deleted');
                res.redirect('/bookings');
            });
        } else {
            res.render('pages/bookings/notfound');
        }
    });
};