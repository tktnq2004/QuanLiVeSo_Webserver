const { sql } = require('../config/db');

const getAll = async () => {
    const result = await sql.query`SELECT * FROM HinhThucThanhToan`;
    return result.recordset;
};

// model
const create = async ({ TenHT }) => {
    const result = await sql.query`
        INSERT INTO HinhThucThanhToan (TenHT)
        OUTPUT INSERTED.*
        VALUES (${TenHT})
    `;
    return result.recordset[0];
};



module.exports = { getAll , create };