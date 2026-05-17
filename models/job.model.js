//const { sql } = require('../config/db');

//// GET ALL
//const getAll = async () => {
//    const result = await sql.query`SELECT * FROM MA_NGHE`;
//    return result.recordset;
//};

//// GET BY ID
//const getById = async (id) => {
//    const result = await sql.query`
//        SELECT * FROM MA_NGHE WHERE MA_NGHE = ${id}
//    `;
//    return result.recordset[0];
//};

//// CREATE
//const create = async (data) => {
//    const { STT, MA_NGHE, TEN_NGHE } = data;

//    await sql.query`
//        INSERT INTO MA_NGHE (STT, MA_NGHE, TEN_NGHE)
//        VALUES (${STT}, ${MA_NGHE}, ${TEN_NGHE})
//    `;
//};

//// UPDATE
//const update = async (id, data) => {
//    const { STT, TEN_NGHE } = data;

//    await sql.query`
//        UPDATE MA_NGHE
//        SET STT = ${STT},
//            TEN_NGHE = ${TEN_NGHE}
//        WHERE MA_NGHE = ${id}
//    `;
//};

//// DELETE
//const remove = async (id) => {
//    await sql.query`
//        DELETE FROM MA_NGHE WHERE MA_NGHE = ${id}
//    `;
//};

//module.exports = {
//    getAll,
//    getById,
//    create,
//    update,
//    remove
//};