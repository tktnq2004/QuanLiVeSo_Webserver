const express = require('express');
const cors = require('cors');

const { connectDB } = require('./config/db');

const congtysoxoRoute = require('./routes/congtyxoso.route');
const nhomRoute = require('./routes/nhom.route');
const doitacRoute = require('./routes/doitac.route');
const hinhThucThanhToanRoute = require('./routes/hinhthucthanhtoan.route');
const dotPhatHanhRoute = require('./routes/dotphathanh.route');
const capVeRoute = require('./routes/capve.route');
const phieuRoute = require('./routes/phieu.route');
const socaiRoute = require('./routes/socai.route');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'QuanLyVeSo API is running'
    });
});

app.use('/api/congtysoxo', congtysoxoRoute);
app.use('/api/nhom', nhomRoute);
app.use('/api/doitac', doitacRoute);
app.use('/api/hinhthucthanhtoan', hinhThucThanhToanRoute);
app.use('/api/dotphathanh', dotPhatHanhRoute);
app.use('/api/capve', capVeRoute);
app.use('/api/phieu', phieuRoute);
app.use('/api/socai', socaiRoute);

// Connect DB một lần
connectDB();

// Chỉ listen khi chạy local
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;