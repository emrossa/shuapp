const express = require('express');
const router = express.Router();
const passport = require('passport');

const controller = require('../controllers/auth');

router.get('/login', controller.loginForm);

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    failureFlash: 'Invalid username or password.'
}), controller.login);

router.get('/register', controller.registerForm);
router.post('/register', controller.register);

router.get('/logout', controller.logout);

module.exports = router;