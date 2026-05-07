const service = require('../services/employee.service');

const create = async (req, res) => {
    try {
        const data = req.body;

        if (!data.MA_NV || !data.HO_TEN) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }

        await service.create(data);
        res.send('Created');

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAll = async (req, res) => {
    const data = await service.getAll();
    res.json(data);
};

const getById = async (req, res) => {
    const data = await service.getById(req.params.id);
    res.json(data);
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