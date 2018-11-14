const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    membername: String,
    memberjob: String,
    memberprice: Number
});

module.exports = mongoose.model('teamInfo', teamSchema, 'teamInfo');