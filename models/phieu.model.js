const { sql } = require('../config/db');


// GET ALL
const getAll = async () => {

    const result = await sql.query`

        SELECT
            P.ID,
            P.NgayGiao,
            P.MaDoiTac,
            DT.TenDoiTac,
            P.Loai,
            P.LoaiChiTiet,
            P.SoCT,
            P.MaHT,
            HT.TenHT,
            P.GhiChu,
            P.NgayTao

        FROM Phieu P

        LEFT JOIN DoiTac DT
            ON P.MaDoiTac = DT.MaDoiTac

        LEFT JOIN HinhThucThanhToan HT
            ON P.MaHT = HT.MaHT

        WHERE P.Xoa = 0

        ORDER BY
            P.NgayGiao DESC,
            P.ID DESC

    `;

    return result.recordset;
};


// GET BY ID
const getById = async (id) => {

    // HEADER
    const phieuResult = await sql.query`

        SELECT
            P.*,
            DT.TenDoiTac,
            HT.TenHT

        FROM Phieu P

        LEFT JOIN DoiTac DT
            ON P.MaDoiTac = DT.MaDoiTac

        LEFT JOIN HinhThucThanhToan HT
            ON P.MaHT = HT.MaHT

        WHERE
            P.ID = ${id}
            AND P.Xoa = 0

    `;

    if (phieuResult.recordset.length === 0) {
        return null;
    }

    const phieu = phieuResult.recordset[0];

    // DETAIL
    const chiTietResult = await sql.query`

        SELECT
            SC.*,
            DPH.DienGiai AS TenDot

        FROM SoCai SC

        LEFT JOIN DotPhatHanh DPH
            ON SC.MaDot = DPH.MaDot

        WHERE
            SC.IDPhieu = ${id}
            AND SC.Xoa = 0

        ORDER BY
            SC.ID ASC

    `;

    phieu.ChiTietSoCai = chiTietResult.recordset;

    return phieu;
};


// CREATE
const create = async (data) => {

    const {
        NgayGiao,
        MaDoiTac,
        Loai,
        LoaiChiTiet,
        SoCT,
        MaHT,
        GhiChu,
        ChiTietSoCai
    } = data;

    const transaction = new sql.Transaction();

    await transaction.begin();

    try {

        const request = new sql.Request(transaction);

        // INSERT PHIEU
        const phieuResult = await request.query`

            INSERT INTO Phieu (
                NgayGiao,
                MaDoiTac,
                Loai,
                LoaiChiTiet,
                SoCT,
                MaHT,
                GhiChu
            )

            OUTPUT INSERTED.ID

            VALUES (
                ${NgayGiao},
                ${MaDoiTac},
                ${Loai},
                ${LoaiChiTiet || null},
                ${SoCT || null},
                ${MaHT || null},
                ${GhiChu || null}
            )

        `;

        const idPhieu = phieuResult.recordset[0].ID;

        // INSERT DETAILS
        for (const item of ChiTietSoCai) {

            const detailRequest = new sql.Request(transaction);

            await detailRequest.query`

                INSERT INTO SoCai (
                    IDPhieu,
                    NgayGiao,
                    MaDot,
                    MaDoiTac,
                    Loai,
                    LoaiChiTiet,
                    SoLuong,
                    DonGia,
                    TienTra,
                    TyLeThanhToan,
                    ThanhTien,
                    SoCT,
                    MaHT,
                    GhiChu
                )

                VALUES (
                    ${idPhieu},
                    ${NgayGiao},
                    ${item.MaDot},
                    ${MaDoiTac},
                    ${item.Loai || Loai},
                    ${item.LoaiChiTiet || LoaiChiTiet},
                    ${item.SoLuong || 0},
                    ${item.DonGia || 0},
                    ${item.TienTra || 0},
                    ${item.TyLeThanhToan || 1},
                    ${item.ThanhTien || 0},
                    ${SoCT || null},
                    ${MaHT || null},
                    ${item.GhiChu || null}
                )

            `;
        }

        await transaction.commit();

        return {
            success: true,
            idPhieu,
            message: 'Lưu phiếu thành công'
        };

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};


// SOFT DELETE
const remove = async (id) => {

    const transaction = new sql.Transaction();

    await transaction.begin();

    try {

        const request1 = new sql.Request(transaction);

        await request1.query`

            UPDATE Phieu

            SET
                Xoa = 1,
                NgaySuaCuoi = GETDATE()

            WHERE ID = ${id}

        `;

        const request2 = new sql.Request(transaction);

        await request2.query`

            UPDATE SoCai

            SET
                Xoa = 1,
                NgaySuaCuoi = GETDATE()

            WHERE IDPhieu = ${id}

        `;

        await transaction.commit();

        return {
            success: true,
            message: 'Hủy phiếu thành công'
        };

    } catch (error) {

        await transaction.rollback();

        throw error;
    }
};

module.exports = {
    getAll,
    getById,
    create,
    remove
};