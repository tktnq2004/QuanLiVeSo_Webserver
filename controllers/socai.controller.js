const model = require('../models/socai.model');

/* ================================
   CREATE PHIEU
================================ */
const createPhieu = async (req, res) => {

    try {

        const {
            NgayGiao,
            MaDoiTac,
            Loai,
            MaDot,
            SoLuong,
            DonGia,
            TyLeThanhToan,
            TienTra,
            MaHT,
            SoCT,
            GhiChu,
        } = req.body;

        // Validate bắt buộc
        if (!NgayGiao || !MaDoiTac || !Loai) {
            return res.status(400).json({
                message: 'Thiếu dữ liệu bắt buộc: NgayGiao, MaDoiTac, Loai'
            });
        }

        // Loai vé cần có MaDot
        const isVe = [
            model.LOAI.NHAP_VE,
            model.LOAI.BAN_VE,
            model.LOAI.TRA_VE,
            model.LOAI.THU_VE
        ].includes(Number(Loai));

        if (isVe && !MaDot) {
            return res.status(400).json({
                message: 'Nghiệp vụ vé cần có MaDot'
            });
        }

        const result = await model.createPhieu({
            NgayGiao,
            MaDoiTac,
            Loai: Number(Loai),
            MaDot: MaDot ?? null,
            SoLuong: SoLuong ?? 0,
            DonGia: DonGia ?? 0,
            TyLeThanhToan: TyLeThanhToan ?? 1,
            TienTra: TienTra ?? 0,
            MaHT: MaHT ?? null,
            SoCT: SoCT ?? null,
            GhiChu: GhiChu ?? null,
            UserTao: req.user?.username ?? null,
        });

        res.status(201).json({
            message: 'Created',
            IDPhieu: result.IDPhieu
        });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

/* ================================
   DELETE PHIEU (soft)
================================ */
const deletePhieu = async (req, res) => {

    try {

        const { id } = req.params;

        await model.deletePhieu(
            id,
            req.user?.username ?? null
        );

        res.json({ message: 'Deleted' });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

/* ================================
   GET BY PHIEU
================================ */
const getByPhieu = async (req, res) => {

    try {

        const data = await model.getByPhieu(req.params.id);

        if (!data) {
            return res.status(404).json({
                message: 'Không tìm thấy phiếu'
            });
        }

        res.json(data);

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

/* ================================
   BAO CAO
================================ */
const getBaoCao = async (req, res) => {

    try {

        const { maDoiTac } = req.params;
        const { tuNgay, denNgay } = req.query;

        if (!maDoiTac) {
            return res.status(400).json({
                message: 'Thiếu mã đối tác'
            });
        }

        const data = await model.getBaoCaoByDoiTac({
            maDoiTac,
            tuNgay,
            denNgay
        });

        res.json(data);

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

const getByLoai = async (req, res) => {

    try {

        const loai = Number(req.params.loai);

        if (!loai) {
            return res.status(400).json({
                message: 'Thiếu loại nghiệp vụ'
            });
        }

        const data = await model.getByLoai(loai);

        res.json(data);

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getByLoai,
    createPhieu,
    deletePhieu,
    getByPhieu,
    getBaoCao,
};

