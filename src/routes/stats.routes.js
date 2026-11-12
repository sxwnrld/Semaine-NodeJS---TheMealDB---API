const express = require('express');
const controller = require('../controllers/stats.controller');

const router = express.Router();

router.get('/', controller.getStats);

module.exports = router;
