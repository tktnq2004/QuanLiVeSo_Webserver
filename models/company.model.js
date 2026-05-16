const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {
    const result = await sql.query`SELECT * FROM MA_CTY`;
    return result.recordset;
};

// GET BY ID
const getById = async (id) => {
    const result = await sql.query`
        SELECT * FROM MA_CTY WHERE MA_CTY = ${id}
    `;
    return result.recordset[0];
};

// CREATE
const create = async (data) => {
    const { MA_CTY, TEN_CTY, MA_THU_TU } = data;

    await sql.query`
        INSERT INTO MA_CTY (MA_CTY, TEN_CTY, MA_THU_TU)
        VALUES (${MA_CTY}, ${TEN_CTY}, ${MA_THU_TU})
    `;
};

// UPDATE
const update = async (id, data) => {
    const { TEN_CTY, MA_THU_TU } = data;

    await sql.query`
        UPDATE MA_CTY
        SET TEN_CTY = ${TEN_CTY},
            MA_THU_TU = ${MA_THU_TU}
        WHERE MA_CTY = ${id}
    `;
};

// DELETE
const remove = async (id) => {
    await sql.query`
        DELETE FROM MA_CTY WHERE MA_CTY = ${id}
    `;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};