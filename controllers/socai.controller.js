const model = require('../models/socai.model');

const getBaoCao = async (req, res) => {

    try {

        const { maDoiTac } = req.params;

        const {
            tuNgay,
            denNgay
        } = req.query;

        if (!maDoiTac) {

            return res.status(400).json({
                message: 'Thiếu mã đối tác'
            });
        }

        const data =
            await model.getBaoCaoByDoiTac({
                maDoiTac,
                tuNgay,
                denNgay
            });

        res.json(data);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getBaoCao
};