const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {

    const result = await sql.query`

        SELECT
            DT.MaDoiTac,
            DT.TenDoiTac,
            DT.MaNhom,
            N.TenNhom,
            DT.PhanLoai,
            DT.DiaChi,
            DT.DienThoai,
            DT.SoTaiKhoan,
            DT.TenChuSoHuu,
            DT.TenNganHang,
            DT.NoDauKy
        FROM DoiTac DT
        LEFT JOIN Nhom N
            ON DT.MaNhom = N.MaNhom
        ORDER BY DT.MaDoiTac

    `;

    return result.recordset;
};

// GET BY ID
const getById = async (id) => {

    const result = await sql.query`

        SELECT *
        FROM DoiTac
        WHERE MaDoiTac = ${id}

    `;

    return result.recordset[0];
};

// CREATE
const create = async (data) => {

    const {
        MaDoiTac,
        TenDoiTac,
        MaNhom,
        PhanLoai,
        DiaChi,
        DienThoai,
        SoTaiKhoan,
        TenChuSoHuu,
        TenNganHang,
        NoDauKy
    } = data;

    await sql.query`

        INSERT INTO DoiTac (
            MaDoiTac,
            TenDoiTac,
            MaNhom,
            PhanLoai,
            DiaChi,
            DienThoai,
            SoTaiKhoan,
            TenChuSoHuu,
            TenNganHang,
            NoDauKy
        )
        VALUES (
            ${MaDoiTac},
            ${TenDoiTac},
            ${MaNhom || null},
            ${PhanLoai || null},
            ${DiaChi || null},
            ${DienThoai || null},
            ${SoTaiKhoan || null},
            ${TenChuSoHuu || null},
            ${TenNganHang || null},
            ${NoDauKy || 0}
        )

    `;
};

// UPDATE
const update = async (id, data) => {

    const {
        TenDoiTac,
        MaNhom,
        PhanLoai,
        DiaChi,
        DienThoai,
        SoTaiKhoan,
        TenChuSoHuu,
        TenNganHang,
        NoDauKy
    } = data;

    await sql.query`

        UPDATE DoiTac
        SET
            TenDoiTac = ${TenDoiTac},
            MaNhom = ${MaNhom || null},
            PhanLoai = ${PhanLoai || null},
            DiaChi = ${DiaChi || null},
            DienThoai = ${DienThoai || null},
            SoTaiKhoan = ${SoTaiKhoan || null},
            TenChuSoHuu = ${TenChuSoHuu || null},
            TenNganHang = ${TenNganHang || null},
            NoDauKy = ${NoDauKy || 0}
        WHERE MaDoiTac = ${id}

    `;
};

// DELETE
const remove = async (id) => {

    await sql.query`

        DELETE FROM DoiTac
        WHERE MaDoiTac = ${id}

    `;
};

// CONG NO
const getCongNo = async (id) => {

    const result = await sql.query`

        SELECT
            DT.MaDoiTac,
            DT.TenDoiTac,

            DT.NoDauKy AS NoCu,

            ISNULL(SUM(SC.ThanhTien), 0) AS TongPhatSinh,

            ISNULL(SUM(SC.TienTra), 0) AS TongDaTra,

            (
                DT.NoDauKy
                + ISNULL(SUM(SC.ThanhTien), 0)
                - ISNULL(SUM(SC.TienTra), 0)
            ) AS ConNoHienTai

        FROM DoiTac DT

        LEFT JOIN SoCai SC
            ON DT.MaDoiTac = SC.MaDoiTac
            AND ISNULL(SC.Xoa, 0) = 0

        WHERE DT.MaDoiTac = ${id}

        GROUP BY
            DT.MaDoiTac,
            DT.TenDoiTac,
            DT.NoDauKy

    `;

    return result.recordset[0];
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    getCongNo
};