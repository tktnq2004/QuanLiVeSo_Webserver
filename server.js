const express = require('express');
const { connectDB, sql } = require('./config/db');

const app = express();

const PORT = 3000;
connectDB();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);


});

app.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM NHAP_XUAT`;
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});