const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

module.exports = mongoose.model('userInfo', userSchema, 'userInfo');

module.exports.createUser = function (newUser, callback) {
    bcrypt.hash(newUser.password, 10, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
};