const mongoose = require('mongoose');

const timingSchema = new mongoose.Schema({
    hours: String,
    timeprice: Number
});

module.exports = mongoose.model('timingInfo', timingSchema, 'timingInfo');