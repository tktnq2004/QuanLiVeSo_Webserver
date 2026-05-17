//const { sql } = require('../config/db');

//// GET ALL
//const getAll = async () => {
//    const result = await sql.query`
//        SELECT H.*, C.TEN_CTY
//        FROM MA_HANG H
//        LEFT JOIN MA_CTY C ON H.MA_CTY = C.MA_CTY
//    `;
//    return result.recordset;
//};

//// GET BY ID
//const getById = async (id) => {
//    const result = await sql.query`
//        SELECT * FROM MA_HANG WHERE MA_VE = ${id}
//    `;
//    return result.recordset[0];
//};

//// CREATE
//const create = async (data) => {
//    const { MA_VE, TEN_VE, MA_SO, MA_CTY, DON_VI, DG_CAP } = data;

//    await sql.query`
//        INSERT INTO MA_HANG (MA_VE, TEN_VE, MA_SO, MA_CTY, DON_VI, DG_CAP)
//        VALUES (${MA_VE}, ${TEN_VE}, ${MA_SO}, ${MA_CTY}, ${DON_VI}, ${DG_CAP})
//    `;
//};

//// UPDATE
//const update = async (id, data) => {
//    const { TEN_VE, MA_SO, MA_CTY, DON_VI, DG_CAP } = data;

//    await sql.query`
//        UPDATE MA_HANG
//        SET TEN_VE = ${TEN_VE},
//            MA_SO = ${MA_SO},
//            MA_CTY = ${MA_CTY},
//            DON_VI = ${DON_VI},
//            DG_CAP = ${DG_CAP}
//        WHERE MA_VE = ${id}
//    `;
//};

//// DELETE
//const remove = async (id) => {
//    await sql.query`
//        DELETE FROM MA_HANG WHERE MA_VE = ${id}
//    `;
//};

//module.exports = {
//    getAll,
//    getById,
//    create,
//    update,
//    remove
//};