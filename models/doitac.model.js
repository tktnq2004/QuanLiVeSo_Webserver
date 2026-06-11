const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {

    const pool = await sql.connect();

    const result = await pool
        .request()
        .query(`
            SELECT
                DT.MaDoiTac,
                DT.TenDoiTac,
                DT.DienThoai,
                DT.DiaChi,
                DT.PhanLoai,
                DT.NoDauKy,

                N.TenNhom,

                ISNULL(
                    SUM(
                        ISNULL(SC.ThanhTien, 0)
                        - ISNULL(SC.TienTra, 0)
                    ),
                    0
                ) + ISNULL(DT.NoDauKy, 0)
                AS CongNo

            FROM DoiTac DT

            LEFT JOIN Nhom N
            ON DT.MaNhom = N.MaNhom

            LEFT JOIN SoCai SC
            ON DT.MaDoiTac = SC.MaDoiTac
            AND SC.Xoa = 0

            GROUP BY
                DT.MaDoiTac,
                DT.TenDoiTac,
                DT.DienThoai,
                DT.DiaChi,
                DT.PhanLoai,
                DT.NoDauKy,
                N.TenNhom

            ORDER BY DT.TenDoiTac
        `);

    return result.recordset;
};

// GET BY ID
const getById = async (id) => {
    const result = await sql.query`
        SELECT * FROM DoiTac WHERE MaDoiTac = ${id}
    `;
    return result.recordset[0];
};

// CREATE
const create = async (data) => {
    const {
        MaDoiTac, TenDoiTac, MaNhom, PhanLoai,
        DiaChi, DienThoai, SoTaiKhoan,
        TenChuSoHuu, TenNganHang, NoDauKy
    } = data;

    await sql.query`
        INSERT INTO DoiTac (
            MaDoiTac, TenDoiTac, MaNhom, PhanLoai,
            DiaChi, DienThoai, SoTaiKhoan,
            TenChuSoHuu, TenNganHang, NoDauKy
        )
        VALUES (
            ${MaDoiTac}, ${TenDoiTac}, ${MaNhom}, ${PhanLoai},
            ${DiaChi}, ${DienThoai}, ${SoTaiKhoan},
            ${TenChuSoHuu}, ${TenNganHang}, ${NoDauKy}
        )
    `;
};

// UPDATE
const update = async (id, data) => {
    const {
        TenDoiTac, MaNhom, PhanLoai,
        DiaChi, DienThoai, SoTaiKhoan,
        TenChuSoHuu, TenNganHang, NoDauKy
    } = data;

    await sql.query`
        UPDATE DoiTac
        SET TenDoiTac = ${TenDoiTac},
            MaNhom = ${MaNhom},
            PhanLoai = ${PhanLoai},
            DiaChi = ${DiaChi},
            DienThoai = ${DienThoai},
            SoTaiKhoan = ${SoTaiKhoan},
            TenChuSoHuu = ${TenChuSoHuu},
            TenNganHang = ${TenNganHang},
            NoDauKy = ${NoDauKy}
        WHERE MaDoiTac = ${id}
    `;
};

// DELETE
const remove = async (id) => {
    await sql.query`
        DELETE FROM DoiTac WHERE MaDoiTac = ${id}
    `;
};

//CALCULATE CONG NO
const getCongNo = async (id) => {
    const result = await sql.query`
        SELECT 
            DT.MaDoiTac, 
            DT.TenDoiTac, 
            DT.NoDauKy AS NoCu,
            ISNULL(SUM(SC.ThanhTien), 0) AS TongPhatSinh,
            ISNULL(SUM(SC.TienTra), 0) AS TongDaTra,
            (DT.NoDauKy + ISNULL(SUM(SC.ThanhTien), 0) - ISNULL(SUM(SC.TienTra), 0)) AS ConNoHienTai
        FROM DoiTac DT
        LEFT JOIN SoCai SC ON DT.MaDoiTac = SC.MaDoiTac
        WHERE DT.MaDoiTac = ${id}
        GROUP BY DT.MaDoiTac, DT.TenDoiTac, DT.NoDauKy
    `;
    return result.recordset[0];
};

const getCanhBaoCongNo = async () => {

    const pool = await sql.connect();

    const result = await pool
        .request()
        .query(`
            SELECT TOP 5
                DT.MaDoiTac,
                DT.TenDoiTac,
                N.TenNhom,

                ISNULL(
                    SUM(
                        ISNULL(SC.ThanhTien, 0)
                        - ISNULL(SC.TienTra, 0)
                    ),
                    0
                ) + ISNULL(DT.NoDauKy, 0)
                AS CongNo

            FROM DoiTac DT

            LEFT JOIN Nhom N
            ON DT.MaNhom = N.MaNhom

            LEFT JOIN SoCai SC
            ON DT.MaDoiTac = SC.MaDoiTac
            AND SC.Xoa = 0

            GROUP BY
                DT.MaDoiTac,
                DT.TenDoiTac,
                DT.NoDauKy,
                N.TenNhom

            HAVING
                ISNULL(
                    SUM(
                        ISNULL(SC.ThanhTien, 0)
                        - ISNULL(SC.TienTra, 0)
                    ),
                    0
                ) + ISNULL(DT.NoDauKy, 0)
                > 10000000

            ORDER BY CongNo DESC
        `);

    return result.recordset;
};

const createQuick = async (data) => {
    const { TenDoiTac, DienThoai, DiaChi, SoTaiKhoan, TenNganHang } = data;

    // sinh MaDoiTac tự động dạng DT + timestamp
    const MaDoiTac = 'DT' + Date.now().toString().slice(-8);

    const result = await sql.query`
        INSERT INTO DoiTac (MaDoiTac, TenDoiTac, DienThoai, DiaChi, SoTaiKhoan, TenNganHang)
        OUTPUT INSERTED.*
        VALUES (${MaDoiTac}, ${TenDoiTac}, ${DienThoai}, ${DiaChi}, ${SoTaiKhoan}, ${TenNganHang})
    `;
    return result.recordset[0];
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getCongNo,
    getCanhBaoCongNo,
    createQuick,
};