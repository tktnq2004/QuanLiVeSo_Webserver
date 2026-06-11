const express = require('express');
const router = express.Router();
const controller = require('../controllers/phieu.controller');


router.post('/transaction', controller.createTransaction);

router.get('/:id', controller.getDetail);


router.put('/:id/huy', controller.huyPhieu);


router.get('/', controller.getAll);

module.exports = router;