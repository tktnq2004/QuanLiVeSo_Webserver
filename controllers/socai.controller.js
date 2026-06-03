const model = require('../models/socai.model');

const createPhieu = async (req, res) => {
    try {
        const {
            NgayGiao, MaDoiTac, Loai,
            MaDot, SoLuong, VeE, DonGia,
            TyLeThanhToan, TienTra,
            MaHT, SoCT, GhiChu,
        } = req.body;

        if (!NgayGiao || !MaDoiTac || !Loai) {
            return res.status(400).json({
                message: 'Thiếu dữ liệu bắt buộc: NgayGiao, MaDoiTac, Loai'
            });
        }

        const loaiSo = Number(Loai);

        const isVe = [
            model.LOAI.NHAP_VE, model.LOAI.BAN_VE,
            model.LOAI.TRA_VE,  model.LOAI.THU_VE,
        ].includes(loaiSo);

        if (isVe && !MaDot) {
            return res.status(400).json({
                message: 'Nghiệp vụ vé cần có MaDot'
            });
        }

        const result = await model.createPhieu({
            NgayGiao,
            MaDoiTac,
            Loai:          loaiSo,
            MaDot:         MaDot         ?? null,
            SoLuong:       SoLuong       ?? 0,
            VeE:           VeE           ?? 0,
            DonGia:        DonGia        ?? 0,
            TyLeThanhToan: TyLeThanhToan ?? 1,
            TienTra:       TienTra       ?? 0,
            MaHT:          MaHT          ?? null,
            SoCT:          SoCT          ?? null,
            GhiChu:        GhiChu        ?? null,
            UserTao:       req.user?.username ?? null,
        });

        res.status(201).json({ message: 'Created', IDPhieu: result.IDPhieu });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePhieu = async (req, res) => {
    try {
        await model.deletePhieu(req.params.id, req.user?.username ?? null);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getByPhieu = async (req, res) => {
    try {
        const data = await model.getByPhieu(req.params.id);
        if (!data?.length) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu' });
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBaoCao = async (req, res) => {
    try {
        const { maDoiTac } = req.params;
        const { tuNgay, denNgay } = req.query;
        if (!maDoiTac) {
            return res.status(400).json({ message: 'Thiếu mã đối tác' });
        }
        const data = await model.getBaoCaoByDoiTac({ maDoiTac, tuNgay, denNgay });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getByLoai = async (req, res) => {
    try {
        const loai = Number(req.params.loai);
        if (!loai) {
            return res.status(400).json({ message: 'Thiếu loại nghiệp vụ' });
        }
        const data = await model.getByLoai(loai);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getThongKe = async (req, res) => {
    try {
        const loai = Number(req.params.loai);
        if (!loai) {
            return res.status(400).json({ message: 'Thiếu loại nghiệp vụ' });
        }
        const data = await model.getThongKe(loai);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPhieu,
    deletePhieu,
    getByPhieu,
    getBaoCao,
    getByLoai,
    getThongKe,
};