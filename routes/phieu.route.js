const express = require('express');
const router = express.Router();
const controller = require('../controllers/phieu.controller');


router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id/remove', controller.remove);

module.exports = router;