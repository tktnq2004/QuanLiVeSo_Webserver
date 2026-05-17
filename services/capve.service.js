const model = require('../models/capve.model');

const getAll = () => model.getAll();

module.exports = { getAll };