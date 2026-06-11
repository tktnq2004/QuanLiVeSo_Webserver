const service = require('../services/capve.service');

const getAll = async (req, res) => {
    try {
        const data = await service.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getById = async (req, res) => {
    try {
        const data = await service.getById(req.params.id);
        if (!data) return res.status(404).send('Không tìm thấy cặp vé');
        res.json(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const create = async (req, res) => {
    try {
        await service.create(req.body);
        res.status(201).send('Created');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const update = async (req, res) => {
    try {
        await service.update(req.params.id, req.body);
        res.send('Updated');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const remove = async (req, res) => {
    try {
        await service.remove(req.params.id);
        res.send('Deleted');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getTicketPairsForSearch = async (req, res) => {
    try {
        // Gọi đúng hàm xử lý vé
        const data = await service.getTicketPairsForSearch();
        res.json(data || []); // Luôn trả về mảng để tránh crash app
    } catch (error) {
        console.error("LỖI API TICKET PAIR:", error);
        res.status(500).send(error.message);
    }
};

module.exports = { getAll, getById, create, update, remove, getTicketPairsForSearch };