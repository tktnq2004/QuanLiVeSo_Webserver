const express = require('express');
const router = express.Router();
const controller = require('../controllers/socai.controller');

router.post('/', controller.createPhieu);
router.delete('/:id', controller.deletePhieu);

// ── GET cụ thể TRƯỚC /:id ───────────────────
router.get('/', controller.getAll);        // ← trước /:id
router.get('/loai/:loai', controller.getByLoai);
router.get('/thongke/:loai', controller.getThongKe);
router.get('/baocao/:maDoiTac', controller.getBaoCao);
router.get('/loinhuan', controller.getLoiNhuan);
router.get('/congno', controller.getCongNo);
router.get('/chitietcongno', controller.getChiTietCongNo);

// ── Route động CUỐI CÙNG ────────────────────
router.get('/:id', controller.getByPhieu);

module.exports = router;