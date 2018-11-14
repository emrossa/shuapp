const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    locationname: String,
    locationprice: Number
});

module.exports = mongoose.model('locationInfo', locationSchema, 'locationInfo');