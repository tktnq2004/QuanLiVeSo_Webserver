const model = require('../models/phieu.model');

const getAll = async (req, res) => {

    try {

        const data = await model.getAll();

        res.json(data);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getById = async (req, res) => {

    try {

        const data = await model.getById(req.params.id);

        if (!data) {

            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu'
            });
        }

        res.json(data);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const create = async (req, res) => {

    try {

        const {
            NgayGiao,
            MaDoiTac,
            Loai,
            LoaiChiTiet,
            ChiTietSoCai
        } = req.body;

        // VALIDATE
        if (!NgayGiao) {

            return res.status(400).json({
                success: false,
                message: 'Ngày giao không được để trống'
            });
        }

        if (!MaDoiTac) {

            return res.status(400).json({
                success: false,
                message: 'Mã đối tác không được để trống'
            });
        }

        if (!Loai) {

            return res.status(400).json({
                success: false,
                message: 'Loại phiếu không được để trống'
            });
        }

        if (!Array.isArray(ChiTietSoCai)) {

            return res.status(400).json({
                success: false,
                message: 'Chi tiết sổ cái không hợp lệ'
            });
        }

        if (ChiTietSoCai.length === 0) {

            return res.status(400).json({
                success: false,
                message: 'Phiếu phải có ít nhất 1 chi tiết'
            });
        }

        const result = await model.create(req.body);

        res.status(201).json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const remove = async (req, res) => {

    try {

        const result = await model.remove(req.params.id);

        res.json(result);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    create,
    getAll,
    getById,
    remove
};