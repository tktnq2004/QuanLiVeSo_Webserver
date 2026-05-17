const model = require('../models/socai.model');

const getBaoCaoByDoiTac = (maDoiTac) => model.getBaoCaoByDoiTac(maDoiTac);

module.exports = { getBaoCaoByDoiTac };