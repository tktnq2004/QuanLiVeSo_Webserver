const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {
    const result = await sql.query`SELECT * FROM MA_NHOM`;
    return result.recordset;
};

// GET BY ID
const getById = async (id) => {
    const result = await sql.query`
        SELECT * FROM MA_NHOM WHERE MA_NHOM = ${id}
    `;
    return result.recordset[0];
};

// CREATE
const create = async (data) => {
    const { STT, MA_NHOM, TEN_NHOM } = data;

    await sql.query`
        INSERT INTO MA_NHOM (STT, MA_NHOM, TEN_NHOM)
        VALUES (${STT}, ${MA_NHOM}, ${TEN_NHOM})
    `;
};

// UPDATE
const update = async (id, data) => {
    const { STT, TEN_NHOM } = data;

    await sql.query`
        UPDATE MA_NHOM
        SET STT = ${STT},
            TEN_NHOM = ${TEN_NHOM}
        WHERE MA_NHOM = ${id}
    `;
};

// DELETE
const remove = async (id) => {
    await sql.query`
        DELETE FROM MA_NHOM WHERE MA_NHOM = ${id}
    `;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};