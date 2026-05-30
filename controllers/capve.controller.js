const model = require('../models/capve.model');
const { sql } = require('../config/db');

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

const getById = async (req, res) => {

    try {

        const data = await model.getById(req.params.id);

        if (!data) {

            return res.status(404).json({
                message: 'Không tìm thấy cặp vé'
            });
        }

        res.json(data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const create = async (req, res) => {

    try {

        const {
            MaCap,
            TenCap,
            MaCTXS
        } = req.body;

        if (!MaCap || !TenCap) {

            return res.status(400).json({
                message: 'Thiếu dữ liệu bắt buộc'
            });
        }

        const exist = await model.getById(MaCap);

        if (exist) {

            return res.status(400).json({
                message: 'Mã cặp vé đã tồn tại'
            });
        }

        if (MaCTXS) {

            const company = await sql.query`
                SELECT TOP 1 *
                FROM CongTyXoSo
                WHERE MaCTXS = ${MaCTXS}
            `;

            if (company.recordset.length === 0) {

                return res.status(400).json({
                    message: 'Mã công ty xổ số không tồn tại'
                });
            }
        }

        await model.create({
            ...req.body,
            Thu2: req.body.Thu2 || 0,
            Thu3: req.body.Thu3 || 0,
            Thu4: req.body.Thu4 || 0,
            Thu5: req.body.Thu5 || 0,
            Thu6: req.body.Thu6 || 0,
            Thu7: req.body.Thu7 || 0,
            CN: req.body.CN || 0
        });

        res.status(201).json({
            message: 'Created'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const update = async (req, res) => {

    try {

        const exist = await model.getById(req.params.id);

        if (!exist) {

            return res.status(404).json({
                message: 'Không tìm thấy cặp vé'
            });
        }

        const { MaCTXS } = req.body;

        if (MaCTXS) {

            const company = await sql.query`
                SELECT TOP 1 *
                FROM CongTyXoSo
                WHERE MaCTXS = ${MaCTXS}
            `;

            if (company.recordset.length === 0) {

                return res.status(400).json({
                    message: 'Mã công ty xổ số không tồn tại'
                });
            }
        }

        await model.update(req.params.id, {
            ...req.body,
            Thu2: req.body.Thu2 || 0,
            Thu3: req.body.Thu3 || 0,
            Thu4: req.body.Thu4 || 0,
            Thu5: req.body.Thu5 || 0,
            Thu6: req.body.Thu6 || 0,
            Thu7: req.body.Thu7 || 0,
            CN: req.body.CN || 0
        });

        res.json({
            message: 'Updated'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const remove = async (req, res) => {

    try {

        const exist = await model.getById(req.params.id);

        if (!exist) {

            return res.status(404).json({
                message: 'Không tìm thấy cặp vé'
            });
        }

        const used = await sql.query`
            SELECT TOP 1 *
            FROM DotPhatHanh
            WHERE MaCap = ${req.params.id}
        `;

        if (used.recordset.length > 0) {

            return res.status(400).json({
                message: 'Cặp vé đã được sử dụng'
            });
        }

        await model.remove(req.params.id);

        res.json({
            message: 'Deleted'
        });

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
    remove
};