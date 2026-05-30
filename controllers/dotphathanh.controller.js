const model = require('../models/dotphathanh.model');

// GET ALL
const getAll = async (req, res) => {

    try {

        const data = await model.getAll();

        res.json(data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// GET BY ID
const getById = async (req, res) => {

    try {

        const data = await model.getById(req.params.id);

        if (!data) {

            return res.status(404).json({
                message: 'Không tìm thấy đợt phát hành'
            });

        }

        res.json(data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// CREATE
const create = async (req, res) => {

    try {

        const {
            MaDot
        } = req.body;

        // VALIDATE
        if (!MaDot?.trim()) {

            return res.status(400).json({
                message: 'Mã đợt không được để trống'
            });

        }

        await model.create(req.body);

        res.status(201).json({
            message: 'Tạo đợt phát hành thành công'
        });

    } catch (error) {

        // DUPLICATE PK
        if (error.number === 2627) {

            return res.status(400).json({
                message: 'Mã đợt đã tồn tại'
            });

        }

        // FK
        if (error.number === 547) {

            return res.status(400).json({
                message: 'Mã cặp vé không tồn tại'
            });

        }

        res.status(500).json({
            message: error.message
        });

    }
};

// UPDATE
const update = async (req, res) => {

    try {

        const existed = await model.getById(req.params.id);

        if (!existed) {

            return res.status(404).json({
                message: 'Không tìm thấy đợt phát hành'
            });

        }

        await model.update(req.params.id, req.body);

        res.json({
            message: 'Cập nhật thành công'
        });

    } catch (error) {

        if (error.number === 547) {

            return res.status(400).json({
                message: 'Mã cặp vé không tồn tại'
            });

        }

        res.status(500).json({
            message: error.message
        });

    }
};

// DELETE
const remove = async (req, res) => {

    try {

        const existed = await model.getById(req.params.id);

        if (!existed) {

            return res.status(404).json({
                message: 'Không tìm thấy đợt phát hành'
            });

        }

        await model.remove(req.params.id);

        res.json({
            message: 'Xóa thành công'
        });

    } catch (error) {

        // FK DELETE
        if (error.number === 547) {

            return res.status(400).json({
                message: 'Đợt phát hành đã phát sinh dữ liệu'
            });

        }

        res.status(500).json({
            message: error.message
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