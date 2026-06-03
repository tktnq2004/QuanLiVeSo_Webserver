const express = require('express');
const router = express.Router();
const controller = require('../controllers/socai.controller');

router.post('/', controller.createPhieu);
router.delete('/:id', controller.deletePhieu);
router.get('/loai/:loai', controller.getByLoai);
router.get('/thongke/:loai', controller.getThongKe);  // phải trước /:id
router.get('/baocao/:maDoiTac', controller.getBaoCao);   // phải trước /:id
router.get('/:id', controller.getByPhieu);

module.exports = router;