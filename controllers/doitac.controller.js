const model = require('../models/doitac.model');

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
                message: 'Không tìm thấy đối tác'
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
            MaDoiTac,
            TenDoiTac
        } = req.body;

        // VALIDATE
        if (!MaDoiTac?.trim()) {

            return res.status(400).json({
                message: 'Mã đối tác không được để trống'
            });

        }

        if (!TenDoiTac?.trim()) {

            return res.status(400).json({
                message: 'Tên đối tác không được để trống'
            });

        }

        await model.create(req.body);

        res.status(201).json({
            message: 'Tạo đối tác thành công'
        });

    } catch (error) {

        // DUPLICATE PK
        if (error.number === 2627) {

            return res.status(400).json({
                message: 'Mã đối tác đã tồn tại'
            });

        }

        // FK
        if (error.number === 547) {

            return res.status(400).json({
                message: 'Mã nhóm không tồn tại'
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
                message: 'Không tìm thấy đối tác'
            });

        }

        await model.update(req.params.id, req.body);

        res.json({
            message: 'Cập nhật thành công'
        });

    } catch (error) {

        if (error.number === 547) {

            return res.status(400).json({
                message: 'Mã nhóm không tồn tại'
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
                message: 'Không tìm thấy đối tác'
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
                message: 'Đối tác đã phát sinh dữ liệu'
            });

        }

        res.status(500).json({
            message: error.message
        });

    }
};

// GET CONG NO
const getCongNo = async (req, res) => {

    try {

        const data = await model.getCongNo(req.params.id);

        if (!data) {

            return res.status(404).json({
                message: 'Không tìm thấy đối tác'
            });

        }

        res.json(data);

    } catch (error) {

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
    remove,
    getCongNo
};