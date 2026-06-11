const express = require('express');
const router = express.Router();
const controller = require('../controllers/doitac.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.get('/:id/congno', controller.getCongNo);
router.get('/canhbaocongno', controller.getCanhBaoCongNo);
router.post('/quick', controller.createQuick);
module.exports = router;