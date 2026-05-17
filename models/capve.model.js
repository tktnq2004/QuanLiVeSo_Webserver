const { sql } = require('../config/db');

const getAll = async () => {
    const result = await sql.query`SELECT * FROM CapVe`;
    return result.recordset;
};

const getById = async (id) => {
    const result = await sql.query`SELECT * FROM CapVe WHERE MaCap = ${id}`;
    return result.recordset[0];
};

const create = async (data) => {
    const { MaCap, TenCap, MaCTXS, Thu2, Thu3, Thu4, Thu5, Thu6, Thu7, CN } = data;
    await sql.query`
        INSERT INTO CapVe (MaCap, TenCap, MaCTXS, Thu2, Thu3, Thu4, Thu5, Thu6, Thu7, CN)
        VALUES (${MaCap}, ${TenCap}, ${MaCTXS}, ${Thu2}, ${Thu3}, ${Thu4}, ${Thu5}, ${Thu6}, ${Thu7}, ${CN})
    `;
};

const update = async (id, data) => {
    const { TenCap, MaCTXS, Thu2, Thu3, Thu4, Thu5, Thu6, Thu7, CN } = data;
    await sql.query`
        UPDATE CapVe
        SET TenCap = ${TenCap}, MaCTXS = ${MaCTXS}, Thu2 = ${Thu2}, Thu3 = ${Thu3}, 
            Thu4 = ${Thu4}, Thu5 = ${Thu5}, Thu6 = ${Thu6}, Thu7 = ${Thu7}, CN = ${CN}
        WHERE MaCap = ${id}
    `;
};

const remove = async (id) => {
    await sql.query`DELETE FROM CapVe WHERE MaCap = ${id}`;
};

module.exports = { getAll, getById, create, update, remove };