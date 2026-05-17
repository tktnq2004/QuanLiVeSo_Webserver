const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {
    const result = await sql.query`SELECT * FROM Nhom`;
    return result.recordset;
};

// GET BY ID
const getById = async (id) => {
    const result = await sql.query`
        SELECT * FROM Nhom WHERE MaNhom = ${id}
    `;
    return result.recordset[0];
};

// CREATE
const create = async (data) => {
    const { MaNhom, TenNhom } = data;
    await sql.query`
        INSERT INTO Nhom (MaNhom, TenNhom)
        VALUES (${MaNhom}, ${TenNhom})
    `;
};

// UPDATE
const update = async (id, data) => {
    const { TenNhom } = data;
    await sql.query`
        UPDATE Nhom
        SET TenNhom = ${TenNhom}
        WHERE MaNhom = ${id}
    `;
};

// DELETE
const remove = async (id) => {
    await sql.query`
        DELETE FROM Nhom WHERE MaNhom = ${id}
    `;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};