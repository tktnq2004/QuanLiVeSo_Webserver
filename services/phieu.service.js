const model = require('../models/phieu.model');

const getAll = () => model.getAll();

const getById = (id) => model.getById(id);

const create = (data) => model.create(data);

const remove = (id) => model.huyPhieu(id);

module.exports = {
    create,
    getById,
    remove
};