const model = require('../models/phieu.model');

const createTransaction = (data) => model.createTransaction(data);

module.exports = { createTransaction };