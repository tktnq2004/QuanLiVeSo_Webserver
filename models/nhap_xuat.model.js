const { sql } = require('../config/db');

// GET ALL
const getAll = async () => {
    const result = await sql.query`
        SELECT NX.*, KH.TEN_KH, H.TEN_VE, NV.HO_TEN
        FROM NHAP_XUAT NX
        LEFT JOIN MA_KHACH_HANG KH ON NX.MA_KH = KH.MA_KH
        LEFT JOIN MA_HANG H ON NX.MA_VE = H.MA_VE
        LEFT JOIN MA_NHAN_VIEN NV ON NX.MA_NV = NV.MA_NV
    `;
    return result.recordset;
};

// CREATE
const create = async (data) => {
    const {
        NGAY, LUOT, MA_KH, MA_VE,
        SL_NHAP, DG_CAP_NHAP, CHI_TIEN,
        SL_XUAT, DG_BAN, THU_TIEN,
        MA_NV, GHICHU
    } = data;

    await sql.query`
        INSERT INTO NHAP_XUAT (
            NGAY, LUOT, MA_KH, MA_VE,
            SL_NHAP, DG_CAP_NHAP, CHI_TIEN,
            SL_XUAT, DG_BAN, THU_TIEN,
            MA_NV, GHICHU
        )
        VALUES (
            ${NGAY}, ${LUOT}, ${MA_KH}, ${MA_VE},
            ${SL_NHAP}, ${DG_CAP_NHAP}, ${CHI_TIEN},
            ${SL_XUAT}, ${DG_BAN}, ${THU_TIEN},
            ${MA_NV}, ${GHICHU}
        )
    `;
};

module.exports = {
    getAll,
    create
};