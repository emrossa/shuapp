const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookings');

router.get('/', controller.index);
router.get('/new', controller.new);
router.post('/new', controller.create);
router.get('/:id', controller.show);
router.get('/:id/delete', controller.delete);

module.exports = router;