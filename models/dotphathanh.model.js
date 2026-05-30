const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {

    const result = await sql.query`

        SELECT
            DPH.MaDot,
            DPH.MaCap,
            CV.TenCap,
            CV.MaCTXS,
            DPH.NgayXo,
            DPH.MaKyXo,
            DPH.DienGiai,
            DPH.NgayGioTao

        FROM DotPhatHanh DPH

        LEFT JOIN CapVe CV
            ON DPH.MaCap = CV.MaCap

        ORDER BY
            DPH.NgayXo DESC,
            DPH.MaDot ASC

    `;

    return result.recordset;
};

// GET BY ID
const getById = async (id) => {

    const result = await sql.query`

        SELECT
            *
        FROM DotPhatHanh
        WHERE MaDot = ${id}

    `;

    return result.recordset[0];
};

// CREATE
const create = async (data) => {

    const {
        MaDot,
        MaCap,
        NgayXo,
        MaKyXo,
        DienGiai
    } = data;

    await sql.query`

        INSERT INTO DotPhatHanh (
            MaDot,
            MaCap,
            NgayXo,
            MaKyXo,
            DienGiai
        )
        VALUES (
            ${MaDot},
            ${MaCap || null},
            ${NgayXo || null},
            ${MaKyXo || null},
            ${DienGiai || null}
        )

    `;
};

// UPDATE
const update = async (id, data) => {

    const {
        MaCap,
        NgayXo,
        MaKyXo,
        DienGiai
    } = data;

    await sql.query`

        UPDATE DotPhatHanh

        SET
            MaCap = ${MaCap || null},
            NgayXo = ${NgayXo || null},
            MaKyXo = ${MaKyXo || null},
            DienGiai = ${DienGiai || null}

        WHERE MaDot = ${id}

    `;
};

// DELETE
const remove = async (id) => {

    await sql.query`

        DELETE FROM DotPhatHanh
        WHERE MaDot = ${id}

    `;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};