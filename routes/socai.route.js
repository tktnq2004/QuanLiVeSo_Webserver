const express = require('express');
const router = express.Router();
const controller = require('../controllers/socai.controller');


router.get('/baocao/:madoitac', controller.getBaoCao);

router.get('/', controller.getAll);

router.get('/mobile', controller.getAllMobile);

router.get('/meta', controller.getSoCaiMeta);

router.get('/dongia', controller.getDonGiaSoCai);

router.get('/payments', controller.getPaymentsForSearch);

router.get('/analytics-v2', controller.getAnalyticsV2);

router.get('/excel', controller.xuatExcelThang);  


module.exports = router;