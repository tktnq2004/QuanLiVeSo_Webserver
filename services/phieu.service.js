const model = require('../models/phieu.model');


const createTransaction = (data) => model.createTransaction(data);


const getDetail = (id) => model.getDetail(id);


const huyPhieu = (id) => model.huyPhieu(id);

module.exports = {
    createTransaction,
    getDetail,
    huyPhieu
};