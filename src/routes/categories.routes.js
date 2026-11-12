const express = require('express');
const controller = require('../controllers/categories.controller');

const router = express.Router();

router.get('/', controller.listerCategories);

module.exports = router;
