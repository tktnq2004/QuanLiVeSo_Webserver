const model = require('../models/socai.model');

const getBaoCaoByDoiTac = (maDoiTac, tuNgay, denNgay) => {
    return model.getBaoCaoByDoiTac({
        maDoiTac,
        tuNgay,
        denNgay
    });
};

module.exports = { getBaoCaoByDoiTac };