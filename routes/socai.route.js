const express = require('express');
const router = express.Router();
const controller = require('../controllers/socai.controller');

router.get('/baocao/:madoitac', controller.getBaoCao);

module.exports = router;