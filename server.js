const express = require('express');
const { connectDB, sql } = require('./config/db');
const companyRoute = require('./routes/company.route');
const groupRoute = require('./routes/group.route');
const jobRoute = require('./routes/job.route');
const doitacRoute = require('./routes/doitac.route');
const employeeRoute = require('./routes/employee.route');
const productRoute = require('./routes/product.route');
const nhapXuatRoute = require('./routes/nhap_xuat.route');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/company', companyRoute);
app.use('/api/group', groupRoute);
app.use('/api/job', jobRoute);
app.use('/api/doitac', doitacRoute);
app.use('/api/employee', employeeRoute);
app.use('/api/product', productRoute);
app.use('/api/nhap-xuat', nhapXuatRoute);

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

