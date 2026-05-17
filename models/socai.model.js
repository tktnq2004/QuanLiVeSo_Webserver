const { sql } = require('../config/db');

const getBaoCaoByDoiTac = async (maDoiTac, tuNgay, denNgay) => {
    let queryText = `
        SELECT 
            SC.NgayGiao,
            DPH.NgayXo,
            DPH.DienGiai AS NoiVe,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.SoLuong ELSE 0 END) AS SoCap,
            SUM(CASE WHEN SC.Loai = 2 THEN SC.SoLuong ELSE 0 END) AS SoE,
            (SUM(CASE WHEN SC.Loai = 1 THEN SC.SoLuong ELSE 0 END) - SUM(CASE WHEN SC.Loai = 2 THEN SC.SoLuong ELSE 0 END)) AS ThucBan,
            MAX(SC.DonGia) AS DonGia,
            MAX(SC.TyLeThanhToan) AS TyLeThanhToan,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.ThanhTien ELSE -SC.ThanhTien END) AS ThanhTien
        FROM SoCai SC
        LEFT JOIN DotPhatHanh DPH ON SC.MaDot = DPH.MaDot
        WHERE SC.MaDoiTac = @maDoiTac AND SC.Xoa = 0
    `;

    if (tuNgay) queryText += ` AND SC.NgayGiao >= @tuNgay`;
    if (denNgay) queryText += ` AND SC.NgayGiao <= @denNgay`;

    queryText += `
        GROUP BY SC.NgayGiao, DPH.NgayXo, DPH.DienGiai, SC.MaDot
        ORDER BY SC.NgayGiao DESC
    `;

    const request = new sql.Request();
    request.input('maDoiTac', sql.NVarChar, maDoiTac);
    if (tuNgay) request.input('tuNgay', sql.Date, tuNgay);
    if (denNgay) request.input('denNgay', sql.Date, denNgay);

    const result = await request.query(queryText);
    return result.recordset;
};

module.exports = { getBaoCaoByDoiTac };