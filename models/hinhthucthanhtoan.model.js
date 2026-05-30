const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {

    const result = await sql.query`

        SELECT
            MaHT,
            TenHT
        FROM HinhThucThanhToan
        ORDER BY MaHT ASC

    `;

    return result.recordset;
};

// GET BY ID
const getById = async (id) => {

    const result = await sql.query`

        SELECT
            MaHT,
            TenHT
        FROM HinhThucThanhToan
        WHERE MaHT = ${id}

    `;

    return result.recordset[0];
};

module.exports = {
    getAll,
    getById
};