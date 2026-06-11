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



const getAll = async () => {

    const pool = await sql.connect();

    const result = await pool
        .request()
        .query(`
      SELECT *
      FROM SoCai
      WHERE Xoa = 0
    `);

    return result.recordset;
};

const getAllMobile = async () => {

    const pool = await sql.connect();

    const result = await pool
        .request()
        .query(`
    SELECT
                SC.ID,
                SC.NgayGiao,
                SC.MaDoiTac,
                DT.TenDoiTac,
                SC.MaDot,
                DPH.DienGiai,

                SC.SoLuong,
                SC.DonGia,
                SC.ThanhTien,
                SC.TienTra,

                ISNULL(SC.ThanhTien,0) - ISNULL(SC.TienTra,0) AS CongNoDong
            FROM SoCai SC

            LEFT JOIN DoiTac DT
            ON SC.MaDoiTac = DT.MaDoiTac

            LEFT JOIN DotPhatHanh DPH
            ON SC.MaDot = DPH.MaDot

            WHERE SC.Xoa = 0

            ORDER BY SC.NgayGiao DESC
    `);

    return result.recordset;
}

const getMeta = async () => {
    const result = await sql.query`
        SELECT DISTINCT Loai, LoaiChiTiet
        FROM SoCai
        WHERE Xoa = 0
    `;

    return result.recordset;
};

const getDonGia = async (MaDot, Loai, LoaiChiTiet) => {
    const result = await sql.query`
        SELECT DISTINCT DonGia
        FROM SoCai
        WHERE MaDot = ${MaDot}
        AND Loai = ${Loai}
        AND LoaiChiTiet = ${LoaiChiTiet}
        AND Xoa = 0;
    `;

    return result.recordset[0];
};


const getPaymentsForSearch = async () => {
    const result = await sql.query`
        SELECT 
            sc.ID as id,
            dt.TenDoiTac as TenKhachHang,
            CONVERT(VARCHAR, sc.NgayGiao, 103) as NgayGiaoDich,
            
            -- Lấy trực tiếp tên hình thức đầy đủ, nếu NULL mặc định là Tiền mặt
            ISNULL(ht.TenHT, N'Tiền mặt') as HinhThuc, 
            
            ISNULL(sc.ThanhTien, 0) as SoTien
        FROM SoCai sc
        INNER JOIN DoiTac dt ON sc.MaDoiTac = dt.MaDoiTac
        LEFT JOIN HinhThucThanhToan ht ON sc.MaHT = ht.MaHT 
        WHERE ISNULL(sc.Xoa, 0) = 0
        ORDER BY sc.NgayGiao DESC
    `;
    return result.recordset;
};

const getAnalyticsFilters = async () => {
    const pool = await sql.connect();
    // Lấy danh sách Đài (từ DotPhatHanh) và Đối tác (từ DoiTac)
    const result = await pool.request().query(`
        SELECT MaDot as Value, DienGiai as Label FROM DotPhatHanh;
        SELECT MaDoiTac as Value, TenDoiTac as Label FROM DoiTac;
        SELECT MaHT as Value, TenHT as Label FROM HinhThucThanhToan;
    `);
    return {
        dots: result.recordsets[0],
        doitacs: result.recordsets[1],
        hinhthucs: result.recordsets[2]
    };
};

const getDynamicAnalytics = async (filters) => {
    const topN = parseInt(filters.topN) || 5;
    const { groupType } = filters;

    const pool = await sql.connect();
    const request = pool.request();
    request.input('topVal', sql.Int, topN);

    let selectClause = "";
    let groupClause = "";

    switch (groupType) {
        case 'CASH_FLOW':
            selectClause = "'CASH_FLOW' as Category, dt.MaDoiTac as ID, dt.TenDoiTac as Label, (SUM(sc.ThanhTien) - SUM(sc.TienTra)) as Value";
            groupClause = "dt.MaDoiTac, dt.TenDoiTac";
            break;
        case 'VOLUME':
            selectClause = "'VOLUME' as Category, dot.MaDot as ID, dot.DienGiai as Label, SUM(sc.SoLuong) as Value";
            groupClause = "dot.MaDot, dot.DienGiai";
            break;
        case 'PERFORMANCE':
            selectClause = "'PERFORMANCE' as Category, dt.MaDoiTac as ID, dt.TenDoiTac as Label, AVG(sc.TyLeThanhToan) as Value";
            groupClause = "dt.MaDoiTac, dt.TenDoiTac";
            break;
        default:
            selectClause = "'TREND' as Category, dot.MaDot as ID, dot.DienGiai as Label, SUM(sc.ThanhTien) as Value";
            groupClause = "dot.MaDot, dot.DienGiai";
    }

    const query = `SELECT TOP (@topVal) ${selectClause} FROM SoCai sc 
                   LEFT JOIN DotPhatHanh dot ON sc.MaDot = dot.MaDot 
                   LEFT JOIN DoiTac dt ON sc.MaDoiTac = dt.MaDoiTac 
                   WHERE sc.Xoa = 0 GROUP BY ${groupClause} ORDER BY 4 DESC`;

    const result = await request.query(query);
    return result.recordset;
};

const getBaoCaoDoiTacThang = async (thang, nam) => {
    const pool = await sql.connect();
    const request = pool.request();
    request.input('thang', sql.Int, thang);
    request.input('nam', sql.Int, nam);

    const result = await request.query(`
        SELECT
            DT.MaDoiTac,
            DT.TenDoiTac,
            N.TenNhom,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.SoLuong ELSE 0 END)                          AS TongGiao,
            SUM(CASE WHEN SC.Loai = 2 THEN SC.SoLuong ELSE 0 END)                          AS TongTra,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.SoLuong ELSE 0 END)
                - SUM(CASE WHEN SC.Loai = 2 THEN SC.SoLuong ELSE 0 END)                    AS ThucBan,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.ThanhTien ELSE -SC.ThanhTien END)             AS DoanhThu,
            ISNULL(SUM(SC.TienTra), 0)                                                      AS DaTra,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.ThanhTien ELSE -SC.ThanhTien END)
                - ISNULL(SUM(SC.TienTra), 0)                                                AS ConNo
        FROM SoCai SC
        LEFT JOIN DoiTac DT ON SC.MaDoiTac = DT.MaDoiTac
        LEFT JOIN Nhom N    ON DT.MaNhom   = N.MaNhom
        WHERE SC.Xoa = 0
          AND MONTH(SC.NgayGiao) = @thang
          AND YEAR(SC.NgayGiao)  = @nam
        GROUP BY DT.MaDoiTac, DT.TenDoiTac, N.TenNhom
        ORDER BY DoanhThu DESC
    `);
    return result.recordset;
};

const getBaoCaoDotThang = async (thang, nam) => {
    const pool = await sql.connect();
    const request = pool.request();
    request.input('thang', sql.Int, thang);
    request.input('nam', sql.Int, nam);

    const result = await request.query(`
        SELECT
            DPH.MaDot,
            DPH.DienGiai                                                                     AS TenDot,
            DPH.NgayXo,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.SoLuong ELSE 0 END)                          AS TongGiao,
            SUM(CASE WHEN SC.Loai = 2 THEN SC.SoLuong ELSE 0 END)                          AS TongTra,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.SoLuong ELSE 0 END)
                - SUM(CASE WHEN SC.Loai = 2 THEN SC.SoLuong ELSE 0 END)                    AS ThucBan,
            MAX(SC.DonGia)                                                                   AS DonGia,
            SUM(CASE WHEN SC.Loai = 1 THEN SC.ThanhTien ELSE -SC.ThanhTien END)             AS DoanhThu
        FROM SoCai SC
        LEFT JOIN DotPhatHanh DPH ON SC.MaDot = DPH.MaDot
        WHERE SC.Xoa = 0
          AND MONTH(SC.NgayGiao) = @thang
          AND YEAR(SC.NgayGiao)  = @nam
        GROUP BY DPH.MaDot, DPH.DienGiai, DPH.NgayXo
        ORDER BY DPH.NgayXo ASC
    `);
    return result.recordset;
};

module.exports = {
    getBaoCaoByDoiTac,
    getAll,
    getAllMobile,
    getMeta,
    getDonGia,
    getPaymentsForSearch,
    getDynamicAnalytics,
    getAnalyticsFilters,
    getBaoCaoDoiTacThang,
    getBaoCaoDotThang
};