const service = require('../services/congtyxoso.service');

const getAll = async (req, res) => {
    try {
        const data = await service.getAll();
        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getById = async (req, res) => {
    try {
        const data = await service.getById(req.params.id);
        if (!data) return res.status(404).send('Không tìm thấy công ty xổ số');
        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const create = async (req, res) => {
    try {
        await service.create(req.body);
        res.status(201).send('Created');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const update = async (req, res) => {
    try {
        await service.update(req.params.id, req.body);
        res.send('Updated');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const remove = async (req, res) => {
    try {
        await service.remove(req.params.id);
        res.send('Deleted');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { getAll, getById, create, update, remove };