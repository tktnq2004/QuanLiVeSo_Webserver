const service = require('../services/group.service');

const getAll = async (req, res) => {
    const data = await service.getAll();
    res.json(data);
};

const getById = async (req, res) => {
    const data = await service.getById(req.params.id);
    res.json(data);
};

const create = async (req, res) => {
    await service.create(req.body);
    res.send('Created');
};

const update = async (req, res) => {
    await service.update(req.params.id, req.body);
    res.send('Updated');
};

const remove = async (req, res) => {
    await service.remove(req.params.id);
    res.send('Deleted');
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};