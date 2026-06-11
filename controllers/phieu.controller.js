const service = require('../services/phieu.service');


const createTransaction = async (req, res) => {
    try {
        const result = await service.createTransaction(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const getDetail = async (req, res) => {
    try {
        const data = await service.getDetail(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: 'Không tìm thấy phiếu hoặc phiếu đã bị xóa' });
        res.json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const huyPhieu = async (req, res) => {
    try {
        const result = await service.huyPhieu(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAll = async (req, res) => {

    const data = await service.getAll();

    res.json(data);
};

module.exports = {
    createTransaction,
    getDetail,
    huyPhieu,
    getAll
};