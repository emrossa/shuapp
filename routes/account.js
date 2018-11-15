const express = require('express');
const router = express.Router();
const controller = require('../controllers/account');

router.get('/', controller.myAccount);
router.get('/delete', controller.delete);

module.exports = router;