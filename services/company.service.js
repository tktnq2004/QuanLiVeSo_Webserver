const model = require('../models/company.model');

const getAll = () => model.getAll();
const getById = (id) => model.getById(id);
const create = (data) => model.create(data);
const update = (id, data) => model.update(id, data);
const remove = (id) => model.remove(id);

module.exports = { getAll, getById, create, update, remove };