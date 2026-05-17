const model = require('../models/socai.model');

const getBaoCaoByDoiTac = (maDoiTac, tuNgay, denNgay) => model.getBaoCaoByDoiTac(maDoiTac, tuNgay, denNgay);

module.exports = { getBaoCaoByDoiTac };