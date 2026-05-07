const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {
    const result = await sql.query`
        SELECT KH.*, NH.TEN_NHOM
        FROM MA_KHACH_HANG KH
        LEFT JOIN MA_NHOM NH ON KH.MA_NHOM = NH.MA_NHOM
    `;
    return result.recordset;
};

// GET BY ID
const getById = async (id) => {
    const result = await sql.query`
        SELECT * FROM MA_KHACH_HANG WHERE MA_KH = ${id}
    `;
    return result.recordset[0];
};

// CREATE
const create = async (data) => {
    const {
        MA_KH, TEN_KH, DIA_CHI,
        HO_NGUOI, TEN_NGUOI,
        DIEN_THOAI, FAX,
        TAI_KHOAN, MA_NHOM
    } = data;

    await sql.query`
        INSERT INTO MA_KHACH_HANG (
            MA_KH, TEN_KH, DIA_CHI,
            HO_NGUOI, TEN_NGUOI,
            DIEN_THOAI, FAX,
            TAI_KHOAN, MA_NHOM
        )
        VALUES (
            ${MA_KH}, ${TEN_KH}, ${DIA_CHI},
            ${HO_NGUOI}, ${TEN_NGUOI},
            ${DIEN_THOAI}, ${FAX},
            ${TAI_KHOAN}, ${MA_NHOM}
        )
    `;
};

// UPDATE
const update = async (id, data) => {
    const {
        TEN_KH, DIA_CHI,
        HO_NGUOI, TEN_NGUOI,
        DIEN_THOAI, FAX,
        TAI_KHOAN, MA_NHOM
    } = data;

    await sql.query`
        UPDATE MA_KHACH_HANG
        SET TEN_KH = ${TEN_KH},
            DIA_CHI = ${DIA_CHI},
            HO_NGUOI = ${HO_NGUOI},
            TEN_NGUOI = ${TEN_NGUOI},
            DIEN_THOAI = ${DIEN_THOAI},
            FAX = ${FAX},
            TAI_KHOAN = ${TAI_KHOAN},
            MA_NHOM = ${MA_NHOM}
        WHERE MA_KH = ${id}
    `;
};

// DELETE
const remove = async (id) => {
    await sql.query`
        DELETE FROM MA_KHACH_HANG WHERE MA_KH = ${id}
    `;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};