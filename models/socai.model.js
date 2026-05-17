const { sql } = require('../config/db');

const getBaoCaoByDoiTac = async (maDoiTac) => {
    const result = await sql.query`
        SELECT 
            SC.ID,
            SC.NgayGiao,
            DPH.NgayXo,
            DPH.DienGiai AS NoiVe,
            SC.SoLuong AS SoCap,
            SC.DonGia,
            SC.TyLeThanhToan,
            SC.ThanhTien,
            SC.GhiChu
        FROM SoCai SC
        LEFT JOIN DotPhatHanh DPH ON SC.MaDot = DPH.MaDot
        WHERE SC.MaDoiTac = ${maDoiTac} AND SC.Xoa = 0
        ORDER BY SC.NgayGiao DESC, SC.ID DESC
    `;
    return result.recordset;
};

module.exports = { getBaoCaoByDoiTac };