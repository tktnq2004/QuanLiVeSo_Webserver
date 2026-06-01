const { sql } = require('../config/db');

/* ================================
   CONSTANTS
================================ */
const LOAI = {
    NHAP_VE: 1,
    BAN_VE: 2,
    TRA_VE: 3,
    THU_VE: 4,
    THU_TIEN: 5,
    CHI_TIEN: 6,
};

/* ================================
   CREATE PHIEU + SO CAI (transaction)
================================ */
const createPhieu = async ({
    NgayGiao,
    MaDoiTac,
    Loai,
    MaDot = null,
    SoLuong = 0,    // SoCap gốc từ frontend
    VeE = 0,    // số vé ế
    DonGia = 0,    // mệnh giá
    TyLeThanhToan = 1,    // tỉ lệ thanh toán (%)
    TienTra = 0,    // chỉ dùng cho Thu/Chi tiền (Loai 5,6)
    MaHT = null,
    SoCT = null,
    GhiChu = null,
    UserTao = null,
}) => {

    const transaction = new sql.Transaction();

    try {

        await transaction.begin();

        // ── 1. Insert Phieu ──────────────────────
        const r1 = new sql.Request(transaction);

        r1.input('NgayGiao', sql.Date, NgayGiao);
        r1.input('MaDoiTac', sql.NVarChar, MaDoiTac);
        r1.input('Loai', sql.Int, Loai);
        r1.input('SoCT', sql.NVarChar, SoCT);
        r1.input('MaHT', sql.NVarChar, MaHT);
        r1.input('GhiChu', sql.NVarChar, GhiChu);
        r1.input('UserTao', sql.NVarChar, UserTao);

        const phieuResult = await r1.query(`
            INSERT INTO Phieu (
                NgayGiao, MaDoiTac, Loai,
                SoCT, MaHT, GhiChu, UserTao
            )
            OUTPUT INSERTED.ID
            VALUES (
                @NgayGiao, @MaDoiTac, @Loai,
                @SoCT, @MaHT, @GhiChu, @UserTao
            )
        `);

        const IDPhieu = phieuResult.recordset[0].ID;

        // ── 2. Tính các giá trị phái sinh ────────
        const isVe = [
            LOAI.NHAP_VE,
            LOAI.BAN_VE,
            LOAI.TRA_VE,
            LOAI.THU_VE,
        ].includes(Loai);

        let soLuongLuu, tienTraLuu, thanhTienLuu;

        if (isVe) {
            // ThucNhan = SoCap - VeE
            soLuongLuu = SoLuong - VeE;
            // TienTra = ThucNhan × MenhGia (tổng giá trị mặt vé)
            tienTraLuu = soLuongLuu * DonGia;
            // ThanhTien = TienTra × TyLeThanhToan / 100
            thanhTienLuu = Math.round(tienTraLuu * TyLeThanhToan / 100);
        } else {
            // Thu/Chi tiền: không có vé
            soLuongLuu = 0;
            tienTraLuu = TienTra;
            thanhTienLuu = TienTra;
        }

        // ── 3. Insert SoCai ──────────────────────
        const r2 = new sql.Request(transaction);

        r2.input('IDPhieu', sql.BigInt, IDPhieu);
        r2.input('NgayGiao', sql.Date, NgayGiao);
        r2.input('MaDot', sql.NVarChar, MaDot);
        r2.input('MaDoiTac', sql.NVarChar, MaDoiTac);
        r2.input('Loai', sql.Int, Loai);
        r2.input('SoLuong', sql.Int, soLuongLuu);
        r2.input('DonGia', sql.Decimal(18, 0), DonGia);
        r2.input('TienTra', sql.Decimal(18, 0), tienTraLuu);
        r2.input('TyLeThanhToan', sql.Decimal(18, 2), TyLeThanhToan);
        r2.input('ThanhTien', sql.Decimal(18, 0), thanhTienLuu);
        r2.input('SoCT', sql.NVarChar, SoCT);
        r2.input('MaHT', sql.NVarChar, MaHT);
        r2.input('GhiChu', sql.NVarChar, GhiChu);
        r2.input('UserTao', sql.NVarChar, UserTao);

        await r2.query(`
            INSERT INTO SoCai (
                IDPhieu, NgayGiao, MaDot, MaDoiTac, Loai,
                SoLuong, DonGia, TienTra, TyLeThanhToan, ThanhTien,
                SoCT, MaHT, GhiChu, UserTao
            )
            VALUES (
                @IDPhieu, @NgayGiao, @MaDot, @MaDoiTac, @Loai,
                @SoLuong, @DonGia, @TienTra, @TyLeThanhToan, @ThanhTien,
                @SoCT, @MaHT, @GhiChu, @UserTao
            )
        `);

        await transaction.commit();

        return { IDPhieu };

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

/* ================================
   SOFT DELETE PHIEU + SO CAI
================================ */
const deletePhieu = async (idPhieu, userSua) => {

    const transaction = new sql.Transaction();

    try {

        await transaction.begin();

        const r1 = new sql.Request(transaction);
        r1.input('ID', sql.BigInt, idPhieu);
        r1.input('UserSua', sql.NVarChar, userSua);

        await r1.query(`
            UPDATE Phieu
            SET Xoa = 1, UserSuaCuoi = @UserSua, NgaySuaCuoi = GETDATE()
            WHERE ID = @ID
        `);

        const r2 = new sql.Request(transaction);
        r2.input('IDPhieu', sql.BigInt, idPhieu);
        r2.input('UserSua', sql.NVarChar, userSua);

        await r2.query(`
            UPDATE SoCai
            SET Xoa = 1, UserSuaCuoi = @UserSua, NgaySuaCuoi = GETDATE()
            WHERE IDPhieu = @IDPhieu
        `);

        await transaction.commit();

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

/* ================================
   GET BY PHIEU
================================ */
const getByPhieu = async (idPhieu) => {

    const r = new sql.Request();
    r.input('IDPhieu', sql.BigInt, idPhieu);

    const result = await r.query(`
        SELECT
            P.ID            AS IDPhieu,
            P.NgayGiao,
            P.MaDoiTac,
            DT.TenDoiTac,
            P.Loai,
            P.SoCT,
            P.MaHT,
            HT.TenHT        AS TenHinhThuc,
            P.GhiChu,
            SC.ID           AS IDSoCai,
            SC.MaDot,
            DPH.DienGiai    AS NoiVe,
            DPH.NgayXo,
            SC.SoLuong,
            SC.DonGia,
            SC.TyLeThanhToan,
            SC.TienTra,
            SC.ThanhTien
        FROM Phieu P
        LEFT JOIN SoCai SC
            ON SC.IDPhieu = P.ID AND SC.Xoa = 0
        LEFT JOIN DoiTac DT
            ON DT.MaDoiTac = P.MaDoiTac
        LEFT JOIN HinhThucThanhToan HT
            ON HT.MaHT = P.MaHT
        LEFT JOIN DotPhatHanh DPH
            ON DPH.MaDot = SC.MaDot
        WHERE P.ID = @IDPhieu AND P.Xoa = 0
    `);

    return result.recordset[0] ?? null;
};

/* ================================
   BAO CAO BY DOI TAC
================================ */
const getBaoCaoByDoiTac = async ({ maDoiTac, tuNgay, denNgay }) => {

    const r = new sql.Request();
    r.input('maDoiTac', sql.NVarChar, maDoiTac);

    let where = `WHERE SC.MaDoiTac = @maDoiTac AND SC.Xoa = 0`;

    if (tuNgay) {
        r.input('tuNgay', sql.Date, tuNgay);
        where += ` AND SC.NgayGiao >= @tuNgay`;
    }

    if (denNgay) {
        r.input('denNgay', sql.Date, denNgay);
        where += ` AND SC.NgayGiao <= @denNgay`;
    }

    const result = await r.query(`
        SELECT
            SC.NgayGiao,
            DPH.NgayXo,
            DPH.DienGiai    AS NoiVe,
            SC.MaDot,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.SoLuong ELSE 0 END) AS SoCap,
            SUM(CASE WHEN SC.Loai = 2 THEN SC.SoLuong ELSE 0 END) AS SoE,
            SUM(CASE WHEN SC.Loai IN (1,2) THEN SC.SoLuong
                     WHEN SC.Loai IN (3,4) THEN -SC.SoLuong
                     ELSE 0 END)                                    AS ThucBan,
            MAX(SC.DonGia)          AS DonGia,
            MAX(SC.TyLeThanhToan)   AS TyLeThanhToan,
            SUM(CASE WHEN SC.Loai IN (1,2) THEN SC.ThanhTien
                     WHEN SC.Loai IN (3,4) THEN -SC.ThanhTien
                     ELSE 0 END)                                    AS ThanhTien
        FROM SoCai SC
        LEFT JOIN DotPhatHanh DPH ON SC.MaDot = DPH.MaDot
        ${where}
        GROUP BY SC.NgayGiao, DPH.NgayXo, DPH.DienGiai, SC.MaDot
        ORDER BY SC.NgayGiao DESC, SC.MaDot ASC
    `);

    return result.recordset;
};

/* ================================
   GET BY LOAI
================================ */
const getByLoai = async (loai) => {

    const r = new sql.Request();
    r.input('Loai', sql.Int, loai);

    const result = await r.query(`
        SELECT
            SC.*,
            DT.TenDoiTac,
            HT.TenHT
        FROM SoCai SC
        LEFT JOIN DoiTac DT
            ON DT.MaDoiTac = SC.MaDoiTac
        LEFT JOIN HinhThucThanhToan HT
            ON HT.MaHT = SC.MaHT
        WHERE SC.Loai = @Loai
          AND SC.Xoa = 0
        ORDER BY SC.NgayGiao DESC
    `);

    return result.recordset;
};
/* ================================
   EXPORTS
================================ */
module.exports = {
    LOAI,
    createPhieu,
    deletePhieu,
    getByPhieu,
    getBaoCaoByDoiTac,
    getByLoai,
};

