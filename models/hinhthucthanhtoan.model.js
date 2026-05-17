const { sql } = require('../config/db');

const getAll = async () => {
    const result = await sql.query`SELECT * FROM HinhThucThanhToan`;
    return result.recordset;
};

module.exports = { getAll };