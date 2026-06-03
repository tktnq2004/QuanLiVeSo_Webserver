const { sql } = require('../config/db');

/* ================================
   CONSTANTS
================================ */
const LOAI = {
    NHAP_VE:  1,
    BAN_VE:   2,
    TRA_VE:   3,
    THU_VE:   4,
    THU_TIEN: 5,
    CHI_TIEN: 6,
};

// Loại phụ tương ứng khi có vé ế
const LOAI_PHU = {
    [LOAI.NHAP_VE]: LOAI.TRA_VE,
    [LOAI.BAN_VE]:  LOAI.THU_VE,
};

/* ================================
   CREATE PHIEU + SO CAI
================================ */
const createPhieu = async ({
    NgayGiao,
    MaDoiTac,
    Loai,
    MaDot        = null,
    SoLuong      = 0,
    VeE          = 0,
    DonGia       = 0,
    TyLeThanhToan = 1,
    TienTra      = 0,
    MaHT         = null,
    SoCT         = null,
    GhiChu       = null,
    UserTao      = null,
}) => {

    const transaction = new sql.Transaction();

    try {

        await transaction.begin();

        // ── 1. Insert Phieu ──────────────────────
        const r1 = new sql.Request(transaction);
        r1.input('NgayGiao',  sql.Date,     NgayGiao);
        r1.input('MaDoiTac',  sql.NVarChar, MaDoiTac);
        r1.input('Loai',      sql.Int,      Loai);
        r1.input('SoCT',      sql.NVarChar, SoCT);
        r1.input('MaHT',      sql.NVarChar, MaHT);
        r1.input('GhiChu',    sql.NVarChar, GhiChu);
        r1.input('UserTao',   sql.NVarChar, UserTao);

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

        // ── 2. Helper insert SoCai ───────────────
        const insertSoCai = async (loaiDong, slDong, tienTraDong, thanhTienDong) => {

            const r = new sql.Request(transaction);
            r.input('IDPhieu',        sql.BigInt,        IDPhieu);
            r.input('NgayGiao',       sql.Date,          NgayGiao);
            r.input('MaDot',          sql.NVarChar,      MaDot);
            r.input('MaDoiTac',       sql.NVarChar,      MaDoiTac);
            r.input('Loai',           sql.Int,           loaiDong);
            r.input('SoLuong',        sql.Int,           slDong);
            r.input('DonGia',         sql.Decimal(18,0), DonGia);
            r.input('TienTra',        sql.Decimal(18,0), tienTraDong);
            r.input('TyLeThanhToan',  sql.Decimal(18,2), TyLeThanhToan / 100);
            r.input('ThanhTien',      sql.Decimal(18,0), thanhTienDong);
            r.input('SoCT',           sql.NVarChar,      SoCT);
            r.input('MaHT',           sql.NVarChar,      MaHT);
            r.input('GhiChu',         sql.NVarChar,      GhiChu);
            r.input('UserTao',        sql.NVarChar,      UserTao);

            await r.query(`
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
        };

        // ── 3. Tính & insert dòng chính ──────────
        const isVe    = [LOAI.NHAP_VE, LOAI.BAN_VE, LOAI.TRA_VE, LOAI.THU_VE].includes(Loai);
        const isTien  = [LOAI.THU_TIEN, LOAI.CHI_TIEN].includes(Loai);

        if (isVe) {
            const tienTra    = SoLuong * DonGia;
            const thanhTien  = Math.round(tienTra * TyLeThanhToan / 100);
            await insertSoCai(Loai, SoLuong, 0 ,thanhTien);

            // ── 4. Dòng phụ vé ế (chỉ Nhập/Bán) ─
            const loaiPhu = LOAI_PHU[Loai];
            if (loaiPhu && VeE > 0) {
                const tienTraVeE   = VeE * DonGia;
                const thanhTienVeE = Math.round(tienTraVeE * TyLeThanhToan / 100);
                await insertSoCai(loaiPhu, VeE, tienTraVeE, thanhTienVeE);
            }

        } else if (isTien) {
            await insertSoCai(Loai, 0, TienTra, TienTra);
        }

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
        r1.input('ID',      sql.BigInt,  idPhieu);
        r1.input('UserSua', sql.NVarChar, userSua);
        await r1.query(`
            UPDATE Phieu
            SET Xoa = 1, UserSuaCuoi = @UserSua, NgaySuaCuoi = GETDATE()
            WHERE ID = @ID
        `);

        const r2 = new sql.Request(transaction);
        r2.input('IDPhieu', sql.BigInt,  idPhieu);
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
            P.ID                AS IDPhieu,
            P.NgayGiao,
            P.MaDoiTac,
            DT.TenDoiTac,
            P.Loai,
            P.SoCT,
            P.MaHT,
            HT.TenHT            AS TenHinhThuc,
            P.GhiChu,
            SC.ID               AS IDSoCai,
            SC.Loai             AS LoaiSoCai,
            SC.MaDot,
            DPH.DienGiai        AS NoiVe,
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

    return result.recordset ?? null;
};

/* ================================
   GET THONG KE (Loai 1,2,3,4)
================================ */
const getThongKe = async (loai) => {

    const r = new sql.Request();
    r.input('Loai', sql.Int, loai);

    // Loai 1 → dòng phụ Loai 3 | Loai 2 → dòng phụ Loai 4
    const loaiPhu = loai === LOAI.NHAP_VE ? LOAI.TRA_VE
                  : loai === LOAI.BAN_VE  ? LOAI.THU_VE
                  : null;

    r.input('LoaiPhu', sql.Int, loaiPhu);

    const result = await r.query(`
        SELECT
            P.ID                                                    AS IDPhieu,
            SC_main.NgayGiao,
            SC_main.SoCT,
            SC_main.MaDoiTac,
            DT.TenDoiTac,
            SC_main.MaDot,
            DPH.MaKyXo,
            DPH.DienGiai,
            SC_main.DonGia,
            SC_main.TyLeThanhToan,
            SC_main.SoLuong                                         AS SoCap,
            ISNULL(SC_phu.SoLuong, 0)                               AS VeE,
            SC_main.SoLuong - ISNULL(SC_phu.SoLuong, 0)            AS ThucTinh,
            SC_main.TienTra - ISNULL(SC_phu.TienTra, 0)            AS GiaTri,
            SC_main.ThanhTien - ISNULL(SC_phu.ThanhTien, 0)        AS ThanhTien,
            SC_main.MaHT,
            HT.TenHT,
            SC_main.GhiChu
        FROM Phieu P
        INNER JOIN SoCai SC_main
            ON  SC_main.IDPhieu = P.ID
            AND SC_main.Loai    = @Loai
            AND SC_main.Xoa     = 0
        LEFT JOIN SoCai SC_phu
            ON  SC_phu.IDPhieu  = P.ID
            AND SC_phu.Loai     = @LoaiPhu
            AND SC_phu.Xoa      = 0
        LEFT JOIN DoiTac DT
            ON DT.MaDoiTac = SC_main.MaDoiTac
        LEFT JOIN DotPhatHanh DPH
            ON DPH.MaDot = SC_main.MaDot
        LEFT JOIN HinhThucThanhToan HT
            ON HT.MaHT = SC_main.MaHT
        WHERE P.Xoa = 0
        ORDER BY SC_main.NgayGiao DESC
    `);

    return result.recordset;
};

/* ================================
   GET BY LOAI (raw)
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
        LEFT JOIN DoiTac DT ON DT.MaDoiTac = SC.MaDoiTac
        LEFT JOIN HinhThucThanhToan HT ON HT.MaHT = SC.MaHT
        WHERE SC.Loai = @Loai AND SC.Xoa = 0
        ORDER BY SC.NgayGiao DESC
    `);

    return result.recordset;
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
            DPH.DienGiai                                            AS NoiVe,
            SC.MaDot,
            SUM(CASE WHEN SC.Loai = ${LOAI.NHAP_VE}  THEN SC.SoLuong ELSE 0 END) AS SoCapNhap,
            SUM(CASE WHEN SC.Loai = ${LOAI.TRA_VE}   THEN SC.SoLuong ELSE 0 END) AS VeENhap,
            SUM(CASE WHEN SC.Loai = ${LOAI.BAN_VE}   THEN SC.SoLuong ELSE 0 END) AS SoCapBan,
            SUM(CASE WHEN SC.Loai = ${LOAI.THU_VE}   THEN SC.SoLuong ELSE 0 END) AS VeEBan,
            SUM(CASE WHEN SC.Loai IN (${LOAI.NHAP_VE}, ${LOAI.BAN_VE})
                          THEN SC.SoLuong
                     WHEN SC.Loai IN (${LOAI.TRA_VE}, ${LOAI.THU_VE})
                          THEN -SC.SoLuong
                     ELSE 0 END)                                    AS ThucTinh,
            MAX(SC.DonGia)                                          AS DonGia,
            MAX(SC.TyLeThanhToan)                                   AS TyLeThanhToan,
            SUM(CASE WHEN SC.Loai IN (${LOAI.NHAP_VE}, ${LOAI.BAN_VE})
                          THEN SC.ThanhTien
                     WHEN SC.Loai IN (${LOAI.TRA_VE}, ${LOAI.THU_VE})
                          THEN -SC.ThanhTien
                     ELSE 0 END)                                    AS ThanhTien
        FROM SoCai SC
        LEFT JOIN DotPhatHanh DPH ON SC.MaDot = DPH.MaDot
        ${where}
        GROUP BY SC.NgayGiao, DPH.NgayXo, DPH.DienGiai, SC.MaDot
        ORDER BY SC.NgayGiao DESC, SC.MaDot ASC
    `);

    return result.recordset;
};

module.exports = {
    LOAI,
    createPhieu,
    deletePhieu,
    getByPhieu,
    getBaoCaoByDoiTac,
    getByLoai,
    getThongKe,
};