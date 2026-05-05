const sql = require('mssql');

require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
    },
    port: 1433,
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('DB connection error:', err);
    }
};

module.exports = { sql, connectDB };