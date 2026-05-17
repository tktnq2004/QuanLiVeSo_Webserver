const { sql } = require('../config/db');

const createTransaction = async (data) => {
    const {
        NgayGiao, MaDoiTac, Loai, LoaiChiTiet,
        SoCT, MaHT, GhiChu, ChiTietSoCai
    } = data;

    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
        const request = new sql.Request(transaction);

        const phieuResult = await request.query`
            INSERT INTO Phieu (NgayGiao, MaDoiTac, Loai, LoaiChiTiet, SoCT, MaHT, GhiChu)
            OUTPUT INSERTED.ID
            VALUES (${NgayGiao}, ${MaDoiTac}, ${Loai}, ${LoaiChiTiet}, ${SoCT}, ${MaHT}, ${GhiChu})
        `;

        const idPhieu = phieuResult.recordset[0].ID;

        if (ChiTietSoCai && ChiTietSoCai.length > 0) {
            for (const item of ChiTietSoCai) {
                const detailRequest = new sql.Request(transaction);
                await detailRequest.query`
                    INSERT INTO SoCai (
                        IDPhieu, NgayGiao, MaDot, MaDoiTac, Loai, LoaiChiTiet, 
                        SoLuong, DonGia, TienTra, TyLeThanhToan, ThanhTien, 
                        SoCT, MaHT, GhiChu
                    )
                    VALUES (
                        ${idPhieu}, ${NgayGiao}, ${item.MaDot}, ${MaDoiTac}, ${item.Loai || Loai}, ${item.LoaiChiTiet || LoaiChiTiet}, 
                        ${item.SoLuong || 0}, ${item.DonGia || 0}, ${item.TienTra || 0}, ${item.TyLeThanhToan || 1}, ${item.ThanhTien || 0}, 
                        ${SoCT}, ${MaHT}, ${item.GhiChu}
                    )
                `;
            }
        }

        await transaction.commit();
        return { success: true, idPhieu: idPhieu, message: "Lưu giao dịch thành công!" };

    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = { createTransaction };