const express = require('express');
const { connectDB, sql } = require('./config/db');
const congtysoxoRoute = require('./routes/congtyxoso.route');
const nhomRoute = require('./routes/nhom.route');
const doitacRoute = require('./routes/doitac.route');
const hinhThucThanhToanRoute = require('./routes/hinhthucthanhtoan.route');
const dotPhatHanhRoute = require('./routes/dotphathanh.route');
const capVeRoute = require('./routes/capve.route');
const phieuRoute = require('./routes/phieu.route');
const socaiRoute = require('./routes/socai.route');

const app = express();
const cors = require('cors');


app.use(cors());
app.use(express.json());
app.use('/api/congtyxoso', congtysoxoRoute);
app.use('/api/nhom', nhomRoute);
app.use('/api/doitac', doitacRoute);
app.use('/api/hinhthucthanhtoan', hinhThucThanhToanRoute);
app.use('/api/dotphathanh', dotPhatHanhRoute);
app.use('/api/capve', capVeRoute);
app.use('/api/phieu', phieuRoute);
app.use('/api/socai', socaiRoute);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);

});
