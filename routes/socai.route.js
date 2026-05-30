const express = require('express');
const router = express.Router();
const controller = require('../controllers/socai.controller');

router.get('/baocao/:maDoiTac', controller.getBaoCao);

module.exports = router;