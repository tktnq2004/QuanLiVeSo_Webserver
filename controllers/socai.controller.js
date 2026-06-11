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

const getAll = async (req, res) => {

    const data = await service.getAll();

    res.json(data);
};

const getAllMobile = async (req, res) => {

    const data = await service.getAllMobile();

    res.json(data);
};

const getSoCaiMeta = async (req, res) => {
    try {
        const raw = await service.getSoCaiMeta();

        const loaiList = [...new Set(raw.map(x => x.Loai))];

        const loaiChiTietList = raw.map(x => ({
            Loai: x.Loai,
            LoaiChiTiet: x.LoaiChiTiet
        }));

        res.json({
            loaiList,
            loaiChiTietList
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getDonGiaSoCai = async (req, res) => {
    try {
        const { MaDot, Loai, LoaiChiTiet } = req.query;

        const data = await service.getDonGiaSoCai({
            MaDot,
            Loai,
            LoaiChiTiet
        });

        res.json(data || { DonGia: 0 });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

const getPaymentsForSearch = async (req, res) => {
    try {
        // Gọi chính xác hàm SQL chạy SoCai + DoiTac bạn vừa viết
        const data = await service.getPaymentsForSearch();
        res.json(data || []); // Luôn trả về mảng để tránh crash app
    } catch (error) {
        console.error("LỖI API PAYMENT:", error);
        res.status(500).send(error.message);
    }
};

// THÊM MỚI vào socai.controller.js
const getAnalyticsV2 = async (req, res) => {
    try {

        console.log("DỮ LIỆU FRONTEND GỬI LÊN:", req.query);

        const filters = {
            fromDate: req.query.fromDate,
            toDate: req.query.toDate,
            maDot: req.query.maDot,
            maDoiTac: req.query.maDoiTac,
            groupType: req.query.groupType,
            topN: req.query.topN
        };

        const data = await service.getDynamicAnalytics(filters);
        const filterOptions = await service.getAnalyticsFilters();

        res.json({
            data: data,
            filterOptions
        });
    } catch (error) {
        console.error("LỖI ANALYTICS V2:", error);
        res.status(500).send(error.message);
    }
};

const xuatExcelThang = async (req, res) => {
    try {
        const thang = parseInt(req.query.thang) || new Date().getMonth() + 1;
        const nam = parseInt(req.query.nam) || new Date().getFullYear();
        const download = req.query.download === '1';
        const nguoiTao = req.query.nguoiTao || 'Hệ thống';

        if (thang < 1 || thang > 12)
            return res.status(400).json({ error: 'Tháng không hợp lệ (1-12)' });

        const { base64, fileName } = await service.xuatExcelThang(thang, nam, nguoiTao);

        if (download) {
            const buffer = Buffer.from(base64, 'base64');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Length', buffer.length);
            return res.send(buffer);
        }

        res.json({ base64, fileName });

    } catch (error) {
        console.error('Lỗi xuất Excel:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getBaoCao, getAll, getAllMobile, getSoCaiMeta, getDonGiaSoCai, getPaymentsForSearch, xuatExcelThang, getAnalyticsV2 };