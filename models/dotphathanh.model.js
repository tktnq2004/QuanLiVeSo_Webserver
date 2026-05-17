const { sql } = require('../config/db');

const getAll = async () => {
    const result = await sql.query`SELECT * FROM DotPhatHanh`;
    return result.recordset;
};

const getById = async (id) => {
    const result = await sql.query`SELECT * FROM DotPhatHanh WHERE MaDot = ${id}`;
    return result.recordset[0];
};

const create = async (data) => {
    const { MaDot, MaCap, NgayXo, MaKyXo, DienGiai } = data;
    await sql.query`
        INSERT INTO DotPhatHanh (MaDot, MaCap, NgayXo, MaKyXo, DienGiai)
        VALUES (${MaDot}, ${MaCap}, ${NgayXo}, ${MaKyXo}, ${DienGiai})
    `;
};

const update = async (id, data) => {
    const { MaCap, NgayXo, MaKyXo, DienGiai } = data;
    await sql.query`
        UPDATE DotPhatHanh
        SET MaCap = ${MaCap}, NgayXo = ${NgayXo}, MaKyXo = ${MaKyXo}, DienGiai = ${DienGiai}
        WHERE MaDot = ${id}
    `;
};

const remove = async (id) => {
    await sql.query`DELETE FROM DotPhatHanh WHERE MaDot = ${id}`;
};

module.exports = { getAll, getById, create, update, remove };