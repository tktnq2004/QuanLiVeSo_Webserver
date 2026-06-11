const service = require('../services/hinhthucthanhtoan.service');

const getAll = async (req, res) => {
    try {
        const data = await service.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const create = async (req, res) => {
    try {
        const data = await service.create(req.body);
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getAll , create };