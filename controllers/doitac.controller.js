const service = require('../services/doitac.service');

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

const getCongNo = async (req, res) => {
    try {
        const data = await service.getCongNo(req.params.id);
        if (!data) {
            return res.status(404).send('Không tìm thấy đối tác');
        }
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getCanhBaoCongNo = async (req, res) => {
    try {
        const data = await service.getCanhBaoCongNo();
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


const createQuick = async (req, res) => {
    try {
        const data = await service.createDoiTacQuick(req.body);
        res.json(data);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getCongNo,
    getCanhBaoCongNo,
    createQuick,
};