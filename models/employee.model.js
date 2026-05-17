//const { sql } = require('../config/db');

//// GET ALL
//const getAll = async () => {
//    const result = await sql.query`
//        SELECT NV.*, NG.TEN_NGHE
//        FROM MA_NHAN_VIEN NV
//        LEFT JOIN MA_NGHE NG ON NV.MA_NGHE = NG.MA_NGHE
//    `;
//    return result.recordset;
//};

//// GET BY ID
//const getById = async (id) => {
//    const result = await sql.query`
//        SELECT * FROM MA_NHAN_VIEN WHERE MA_NV = ${id}
//    `;
//    return result.recordset[0];
//};

//// CREATE
//const create = async (data) => {
//    const {
//        MA_NV, HO_TEN, DIA_CHI,
//        LUONG, MA_NGHE, NGAY_VAO_LAM
//    } = data;

//    await sql.query`
//        INSERT INTO MA_NHAN_VIEN (
//            MA_NV, HO_TEN, DIA_CHI,
//            LUONG, MA_NGHE, NGAY_VAO_LAM
//        )
//        VALUES (
//            ${MA_NV}, ${HO_TEN}, ${DIA_CHI},
//            ${LUONG}, ${MA_NGHE}, ${NGAY_VAO_LAM}
//        )
//    `;
//};

//// UPDATE
//const update = async (id, data) => {
//    const {
//        HO_TEN, DIA_CHI,
//        LUONG, MA_NGHE, NGAY_VAO_LAM
//    } = data;

//    await sql.query`
//        UPDATE MA_NHAN_VIEN
//        SET HO_TEN = ${HO_TEN},
//            DIA_CHI = ${DIA_CHI},
//            LUONG = ${LUONG},
//            MA_NGHE = ${MA_NGHE},
//            NGAY_VAO_LAM = ${NGAY_VAO_LAM}
//        WHERE MA_NV = ${id}
//    `;
//};

//// DELETE
//const remove = async (id) => {
//    await sql.query`
//        DELETE FROM MA_NHAN_VIEN WHERE MA_NV = ${id}
//    `;
//};

//module.exports = {
//    getAll,
//    getById,
//    create,
//    update,
//    remove
//};