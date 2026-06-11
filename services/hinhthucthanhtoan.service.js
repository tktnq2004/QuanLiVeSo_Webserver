const model = require('../models/hinhthucthanhtoan.model');

const getAll = () => model.getAll();

const create = (data) => model.create(data);

module.exports = { getAll };