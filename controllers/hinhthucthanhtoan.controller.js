const model = require('../models/hinhthucthanhtoan.model');

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

        const data = await model.getById(
            req.params.id
        );

        if (!data) {

            return res.status(404).json({
                message:
                    'Không tìm thấy hình thức thanh toán'
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
    getById
};