const model = require('../models/doitac.model');

const getAll = () => model.getAll();
const getById = (id) => model.getById(id);
const create = (data) => model.create(data);
const update = (id, data) => model.update(id, data);
const remove = (id) => model.remove(id);
const getCongNo = (id) => model.getCongNo(id);
const createDoiTacQuick = (data) => model.createQuick(data);

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getCongNo,
    createDoiTacQuick,
};