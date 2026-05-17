const model = require('../models/hinhthucthanhtoan.model');

const getAll = () => model.getAll();

module.exports = { getAll };