const express = require('express');
const router = express.Router();
const controller = require('../controllers/hinhthucthanhtoan.controller');

router.get('/', controller.getAll);
// route
router.post('/', controller.create);

module.exports = router;