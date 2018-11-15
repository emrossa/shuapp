const UserInfo = require('../models/user');

module.exports.myAccount = function (req, res) {
    res.render('pages/account', {
        user: req.user
    })
};

module.exports.delete = function (req, res) {
    req.user.remove(function (err) {
        res.redirect('/auth/logout');
    });
};