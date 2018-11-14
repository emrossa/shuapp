const express = require('express');
const router = express.Router();

const controller = require('../controllers/index');

router.get('/', controller.index);
router.get('/people', controller.people);
router.get('/locations', controller.locations);
router.get('/attractions', controller.attractions);
router.get('/timings', controller.timings);

module.exports = router;