const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookingSchema = new mongoose.Schema({
    team:        [{type: ObjectId, ref: 'teamInfo'}],
    attractions: [{type: ObjectId, ref: 'attractionInfo'}],
    location:    {type: ObjectId, ref: 'locationInfo'},
    timing:      {type: ObjectId, ref: 'timingInfo'},
    user:        {type: ObjectId, ref: 'userInfo'},
    bookedOn:    Date,
    bookedFor:   Date,
    totalPrice:  Number
});

module.exports = mongoose.model('bookingInfo', bookingSchema, 'bookingInfo');