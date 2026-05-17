const service = require('../services/phieu.service');

const createTransaction = async (req, res) => {
    try {
        const result = await service.createTransaction(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("Lỗi Transaction:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createTransaction };