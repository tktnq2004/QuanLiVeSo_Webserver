const { sql } = require('../config/db');

const getAll = async () => {

    const result = await sql.query`
        SELECT *
        FROM CapVe
        ORDER BY MaCap
    `;

    return result.recordset;
};

const getById = async (id) => {

    const result = await sql.query`
        SELECT *
        FROM CapVe
        WHERE MaCap = ${id}
    `;

    return result.recordset[0];
};

const create = async (data) => {

    const {
        MaCap,
        TenCap,
        MaCTXS,
        Thu2,
        Thu3,
        Thu4,
        Thu5,
        Thu6,
        Thu7,
        CN
    } = data;

    await sql.query`
        INSERT INTO CapVe (
            MaCap,
            TenCap,
            MaCTXS,
            Thu2,
            Thu3,
            Thu4,
            Thu5,
            Thu6,
            Thu7,
            CN
        )
        VALUES (
            ${MaCap},
            ${TenCap},
            ${MaCTXS},
            ${Thu2},
            ${Thu3},
            ${Thu4},
            ${Thu5},
            ${Thu6},
            ${Thu7},
            ${CN}
        )
    `;
};

const update = async (id, data) => {
    const { TenCap, MaCTXS, Thu2, Thu3, Thu4, Thu5, Thu6, Thu7, CN } = data;
    await sql.query`
        UPDATE CapVe SET
            TenCap  = COALESCE(${TenCap ?? null},  TenCap),
            MaCTXS  = COALESCE(${MaCTXS ?? null},  MaCTXS),
            Thu2    = COALESCE(${Thu2 ?? null},     Thu2),
            Thu3    = COALESCE(${Thu3 ?? null},     Thu3),
            Thu4    = COALESCE(${Thu4 ?? null},     Thu4),
            Thu5    = COALESCE(${Thu5 ?? null},     Thu5),
            Thu6    = COALESCE(${Thu6 ?? null},     Thu6),
            Thu7    = COALESCE(${Thu7 ?? null},     Thu7),
            CN      = COALESCE(${CN ?? null},       CN)
        WHERE MaCap = ${id}
    `;
};

const remove = async (id) => {

    await sql.query`
        DELETE FROM CapVe
        WHERE MaCap = ${id}
    `;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};