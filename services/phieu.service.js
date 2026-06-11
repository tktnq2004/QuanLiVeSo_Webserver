const model = require('../models/phieu.model');


const createTransaction = (data) => model.createTransaction(data);

const getDetail = (id) => model.getDetail(id);


const huyPhieu = (id) => model.huyPhieu(id);

const getAll = () => model.getAll();

module.exports = {
    createTransaction,
    getDetail,
    huyPhieu,
    getAll
};