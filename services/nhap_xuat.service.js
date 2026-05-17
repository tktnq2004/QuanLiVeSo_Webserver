//const { sql } = require('../config/db');
//const model = require('../models/nhap_xuat.model');

//const create = async (data) => {

//    // 1. CHECK FK

//    const checkKH = await sql.query`
//        SELECT 1 FROM MA_KHACH_HANG WHERE MA_KH = ${data.MA_KH}
//    `;
//    if (checkKH.recordset.length === 0) {
//        throw new Error('MA_KH không tồn tại');
//    }

//    const checkVE = await sql.query`
//        SELECT 1 FROM MA_HANG WHERE MA_VE = ${data.MA_VE}
//    `;
//    if (checkVE.recordset.length === 0) {
//        throw new Error('MA_VE không tồn tại');
//    }

//    if (data.MA_NV) {
//        const checkNV = await sql.query`
//            SELECT 1 FROM MA_NHAN_VIEN WHERE MA_NV = ${data.MA_NV}
//        `;
//        if (checkNV.recordset.length === 0) {
//            throw new Error('MA_NV không tồn tại');
//        }
//    }

//    // 2. LOGIC CƠ BẢN

//    if (data.SL_NHAP < 0 || data.SL_XUAT < 0) {
//        throw new Error('Số lượng không hợp lệ');
//    }

//    // auto tính tiền nếu chưa gửi lên
//    if (data.SL_XUAT && data.DG_BAN && !data.THU_TIEN) {
//        data.THU_TIEN = data.SL_XUAT * data.DG_BAN;
//    }

//    if (data.SL_NHAP && data.DG_CAP_NHAP && !data.CHI_TIEN) {
//        data.CHI_TIEN = data.SL_NHAP * data.DG_CAP_NHAP;
//    }

//    return model.create(data);
//};

//const getAll = () => model.getAll();

//module.exports = {
//    getAll,
//    create
//};