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


const getDetail = async (id) => {
    const request = new sql.Request();
    request.input('id', sql.BigInt, id);

    
    const phieuResult = await request.query`
        SELECT P.*, DT.TenDoiTac, HT.TenHT
        FROM Phieu P
        LEFT JOIN DoiTac DT ON P.MaDoiTac = DT.MaDoiTac
        LEFT JOIN HinhThucThanhToan HT ON P.MaHT = HT.MaHT
        WHERE P.ID = @id AND P.Xoa = 0
    `;

    if (phieuResult.recordset.length === 0) return null;
    const phieuInfo = phieuResult.recordset[0];

    const chiTietResult = await request.query`
        SELECT SC.*, DPH.DienGiai AS TenDot
        FROM SoCai SC
        LEFT JOIN DotPhatHanh DPH ON SC.MaDot = DPH.MaDot
        WHERE SC.IDPhieu = @id AND SC.Xoa = 0
    `;

    phieuInfo.ChiTietSoCai = chiTietResult.recordset;
    return phieuInfo;
};

const huyPhieu = async (id) => {
    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
        const request1 = new sql.Request(transaction);
        request1.input('id', sql.BigInt, id);

        await request1.query`
            UPDATE Phieu SET Xoa = 1, NgaySuaCuoi = GETDATE() WHERE ID = @id
        `;

        const request2 = new sql.Request(transaction);
        request2.input('idPhieu', sql.BigInt, id);
        await request2.query`
            UPDATE SoCai SET Xoa = 1, NgaySuaCuoi = GETDATE() WHERE IDPhieu = @idPhieu
        `;

        await transaction.commit();
        return { success: true, message: "Hủy phiếu giao dịch thành công!" };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    createTransaction,
    getDetail,
    huyPhieu
};

module.exports = { createTransaction };