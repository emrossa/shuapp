const UserInfo = require('../models/user');

// display the login form
module.exports.loginForm = function(req, res) {
    res.render('pages/login', {
        error: req.flash('error')
    });
};

// once the user is logged in
module.exports.login = function (req, res) {
    res.redirect('/bookings/new');
};

// log out from the site
module.exports.logout = function (req, res) {
    req.logout();
    res.clearCookie('connect.sid', {path: '/'});
    req.session.destroy(function () {
        res.redirect('/');
    });
};

// registration form
module.exports.registerForm = function(req, res) {
    res.render('pages/register');
};

module.exports.register = function(req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
  
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
            if (err) {
                throw err;
            }

            req.flash('success_message','You have registered, Now please login');
            res.redirect('/auth/login');
        });
    }
}