const model = require('../models/congtyxoso.model');

const getAll = async (req, res) => {
    try {

        const data = await model.getAll();

        return res.json(data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};

const getById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                message: 'Thiếu MaCTXS'
            });
        }

        const data = await model.getById(id);

        if (!data) {
            return res.status(404).json({
                message: 'Không tìm thấy dữ liệu'
            });
        }

        return res.json(data);

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};

const create = async (req, res) => {
    try {

        const { MaCTXS, TenCTXS, Dung = 0 } = req.body;

        // validate
        if (!MaCTXS || !TenCTXS) {
            return res.status(400).json({
                message: 'MaCTXS và TenCTXS là bắt buộc'
            });
        }

        // check exists
        const exists = await model.getById(MaCTXS);

        if (exists) {
            return res.status(409).json({
                message: 'Mã đã tồn tại'
            });
        }

        await model.create({
            MaCTXS,
            TenCTXS,
            Dung
        });

        return res.status(201).json({
            message: 'Created'
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};

const update = async (req, res) => {
    try {

        const { id } = req.params;
        const { TenCTXS, Dung } = req.body;

        if (!TenCTXS) {
            return res.status(400).json({
                message: 'TenCTXS là bắt buộc'
            });
        }

        const exists = await model.getById(id);

        if (!exists) {
            return res.status(404).json({
                message: 'Không tìm thấy dữ liệu'
            });
        }

        await model.update(id, {
            TenCTXS,
            Dung
        });

        return res.json({
            message: 'Updated'
        });

    } catch (err) {

        return res.status(500).json({
            message: err.message
        });

    }
};

const remove = async (req, res) => {
    try {

        const { id } = req.params;

        const exists = await model.getById(id);

        if (!exists) {
            return res.status(404).json({
                message: 'Không tìm thấy dữ liệu'
            });
        }

        await model.remove(id);

        return res.json({
            message: 'Deleted'
        });

    } catch (err) {

        // foreign key constraint
        if (err.number === 547) {
            return res.status(400).json({
                message: 'Dữ liệu đang được sử dụng'
            });
        }

        return res.status(500).json({
            message: err.message
        });

    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};