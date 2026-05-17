const express = require('express');
const router = express.Router();
const controller = require('../controllers/dotphathanh.controller');

router.get('/', controller.getAll);

module.exports = router;