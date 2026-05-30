const { sql } = require('../config/db');

const getAll = async () => {

    const result = await sql.query(`
        SELECT
            MaCTXS,
            TenCTXS,
            Dung
        FROM CongTyXoSo
        ORDER BY MaCTXS
    `);

    return result.recordset;
};

const getById = async (id) => {

    const result = await sql.query`
        SELECT
            MaCTXS,
            TenCTXS,
            Dung
        FROM CongTyXoSo
        WHERE MaCTXS = ${id}
    `;

    return result.recordset[0];
};

const create = async (data) => {

    const MaCTXS = data.MaCTXS?.trim();
    const TenCTXS = data.TenCTXS?.trim();
    const Dung = data.Dung ?? 0;

    await sql.query`
        INSERT INTO CongTyXoSo
        (
            MaCTXS,
            TenCTXS,
            Dung
        )
        VALUES
        (
            ${MaCTXS},
            ${TenCTXS},
            ${Dung}
        )
    `;
};

const update = async (id, data) => {

    const TenCTXS = data.TenCTXS?.trim();
    const Dung = data.Dung ?? 0;

    await sql.query`
        UPDATE CongTyXoSo
        SET
            TenCTXS = ${TenCTXS},
            Dung = ${Dung}
        WHERE MaCTXS = ${id}
    `;
};

const remove = async (id) => {

    // hard delete
    await sql.query`
        DELETE FROM CongTyXoSo
        WHERE MaCTXS = ${id}
    `;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};