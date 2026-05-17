const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {
    const result = await sql.query`SELECT * FROM CongTyXoSo`;
    return result.recordset;
};

// GET BY ID
const getById = async (id) => {
    const result = await sql.query`
        SELECT * FROM CongTyXoSo WHERE MaCTXS = ${id}
    `;
    return result.recordset[0];
};

// CREATE
const create = async (data) => {
    const { MaCTXS, TenCTXS, Dung } = data;
    await sql.query`
        INSERT INTO CongTyXoSo (MaCTXS, TenCTXS, Dung)
        VALUES (${MaCTXS}, ${TenCTXS}, ${Dung})
    `;
};

// UPDATE
const update = async (id, data) => {
    const { TenCTXS, Dung } = data;
    await sql.query`
        UPDATE CongTyXoSo
        SET TenCTXS = ${TenCTXS},
            Dung = ${Dung}
        WHERE MaCTXS = ${id}
    `;
};

// DELETE
const remove = async (id) => {
    await sql.query`
        DELETE FROM CongTyXoSo WHERE MaCTXS = ${id}
    `;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};