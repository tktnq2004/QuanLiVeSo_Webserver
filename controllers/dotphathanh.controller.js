const service = require('../services/dotphathanh.service');

const getAll = async (req, res) => {
    try {
        const data = await service.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = { getAll };