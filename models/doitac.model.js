const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {
    const result = await sql.query`
        SELECT DT.*, N.TenNhom
        FROM DoiTac DT
        LEFT JOIN Nhom N ON DT.MaNhom = N.MaNhom
    `;
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

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};