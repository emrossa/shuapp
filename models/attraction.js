const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    attractionname: String,
    attractionprice: Number
});

module.exports = mongoose.model('attractionInfo', attractionSchema, 'attractionInfo');