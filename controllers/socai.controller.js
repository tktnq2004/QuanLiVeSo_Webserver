const service = require('../services/socai.service');

const getBaoCao = async (req, res) => {
    try {
        const { madoitac } = req.params;
        const { tuNgay, denNgay } = req.query;

        const data = await service.getBaoCaoByDoiTac(madoitac, tuNgay, denNgay);
        res.json(data);
    } catch (error) {
        console.error("Lỗi lấy báo cáo sổ cái:", error);
        res.status(500).send(error.message);
    }
};

module.exports = { getBaoCao };