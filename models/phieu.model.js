const { sql } = require('../config/db');

const getConLaiByDot = async (maDot, transaction) => {
    const request = new sql.Request(transaction);
    request.input('MaDot', sql.NVarChar, maDot);

    const query = `
        SELECT 
            (CASE 
                WHEN DATENAME(dw, D.NgayXo) = 'Monday' THEN C.Thu2
                WHEN DATENAME(dw, D.NgayXo) = 'Tuesday' THEN C.Thu3
                WHEN DATENAME(dw, D.NgayXo) = 'Wednesday' THEN C.Thu4
                WHEN DATENAME(dw, D.NgayXo) = 'Thursday' THEN C.Thu5
                WHEN DATENAME(dw, D.NgayXo) = 'Friday' THEN C.Thu6
                WHEN DATENAME(dw, D.NgayXo) = 'Saturday' THEN C.Thu7
                WHEN DATENAME(dw, D.NgayXo) = 'Sunday' THEN C.CN
            END) as HanMuc,
            ISNULL((SELECT SUM(SoLuong) FROM SoCai WHERE MaDot = D.MaDot AND Xoa = 0), 0) as DaBan
        FROM DotPhatHanh D
        JOIN CapVe C ON D.MaCap = C.MaCap
        WHERE D.MaDot = @MaDot
    `;

    const result = await request.query(query);
    if (result.recordset.length === 0) throw new Error("Không tìm thấy thông tin đợt này!");

    const { HanMuc, DaBan } = result.recordset[0];
    return HanMuc - DaBan;
};

const createTransaction = async (data) => {
    const { NgayGiao, MaDoiTac, Loai, LoaiChiTiet, SoCT, MaHT, GhiChu, ChiTietSoCai, UserTao } = data;

    const transaction = new sql.Transaction();
    await transaction.begin();

    try {
        const request = new sql.Request(transaction);

        const phieuResult = await request.query`
            INSERT INTO Phieu (NgayGiao, MaDoiTac, Loai, LoaiChiTiet, SoCT, MaHT, GhiChu, UserTao)
            OUTPUT INSERTED.ID
            VALUES (${NgayGiao}, ${MaDoiTac}, ${Loai}, ${LoaiChiTiet}, ${SoCT}, ${MaHT}, ${GhiChu}, ${UserTao})
        `;

        const idPhieu = phieuResult.recordset[0].ID;

        if (ChiTietSoCai && ChiTietSoCai.length > 0) {
            for (const item of ChiTietSoCai) {
                const conLai = await getConLaiByDot(item.MaDot, transaction);
                const soLuongNhap = Number(item.SoLuong || 0);

                if (soLuongNhap > conLai) {
                    throw new Error(`Đợt ${item.MaDot} chỉ còn ${conLai} vé. Không thể xuất ${soLuongNhap} vé.`);
                }

                const detailRequest = new sql.Request(transaction);
                await detailRequest.query`
                    INSERT INTO SoCai (
                        IDPhieu, NgayGiao, MaDot, MaDoiTac, Loai, LoaiChiTiet,
                        SoLuong, DonGia, TienTra, TyLeThanhToan, ThanhTien,
                        SoCT, MaHT, GhiChu, UserTao
                    )
                    VALUES (
                        ${idPhieu}, ${NgayGiao}, ${item.MaDot}, ${MaDoiTac},
                        ${item.Loai || Loai}, ${item.LoaiChiTiet || LoaiChiTiet},
                        ${soLuongNhap}, ${item.DonGia || 0}, ${item.TienTra || 0},
                        ${item.TyLeThanhToan || 1}, ${item.ThanhTien || 0},
                        ${SoCT}, ${MaHT}, ${item.GhiChu}, ${UserTao}
                    )
                `;
            }
        }

        await transaction.commit();
        return { success: true, idPhieu, message: "Lưu giao dịch thành công!" };

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

const getAll = async () => {
    const pool = await sql.connect();
    const result = await pool.request().query(`
        SELECT
            P.ID, P.SoCT, P.NgayGiao, P.Loai, P.GhiChu,
            P.LoaiChiTiet, -- Thêm trường này
            P.UserTao,     -- Thêm trường này (hoặc UserTao, NguoiLap...)
            DT.TenDoiTac,
            HT.TenHT,
            ISNULL(SUM(SC.ThanhTien), 0) AS ThanhTien
        FROM Phieu P
        LEFT JOIN DoiTac DT ON P.MaDoiTac = DT.MaDoiTac
        LEFT JOIN HinhThucThanhToan HT ON P.MaHT = HT.MaHT
        LEFT JOIN SoCai SC ON P.ID = SC.IDPhieu AND SC.Xoa = 0
        WHERE P.Xoa = 0
        GROUP BY 
            P.ID, P.SoCT, P.NgayGiao, P.Loai, P.GhiChu, 
            P.LoaiChiTiet, P.UserTao, DT.TenDoiTac, HT.TenHT
        ORDER BY P.ID DESC
    `);
    return result.recordset;
};



module.exports = {
    createTransaction,
    getDetail,
    huyPhieu,
    getAll
};