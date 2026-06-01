const express = require('express');
const router = express.Router();
const controller = require('../controllers/socai.controller');

router.post('/', controller.createPhieu);
router.get('/loai/:loai', controller.getByLoai);
router.get('/baocao/:maDoiTac', controller.getBaoCao);
router.get('/:id', controller.getByPhieu);
router.delete('/:id', controller.deletePhieu);

module.exports = router;