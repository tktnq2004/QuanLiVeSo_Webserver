const express = require('express');
const router = express.Router();
const controller = require('../controllers/phieu.controller');

router.post('/', controller.createTransaction);
router.get('/:id', controller.getDetail);
router.put('/:id/huy', controller.huyPhieu);

module.exports = router;