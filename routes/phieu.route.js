const express = require('express');
const router = express.Router();
const controller = require('../controllers/phieu.controller');

router.post('/', controller.createTransaction);

module.exports = router;