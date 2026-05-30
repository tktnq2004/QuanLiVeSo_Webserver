const { sql } = require('../config/db');

const getBaoCaoByDoiTac = async ({
    maDoiTac,
    tuNgay,
    denNgay
}) => {

    const request = new sql.Request();

    request.input(
        'maDoiTac',
        sql.NVarChar,
        maDoiTac
    );

    let whereClause = `
        WHERE
            SC.MaDoiTac = @maDoiTac
            AND SC.Xoa = 0
    `;

    if (tuNgay) {

        request.input(
            'tuNgay',
            sql.Date,
            tuNgay
        );

        whereClause += `
            AND SC.NgayGiao >= @tuNgay
        `;
    }

    if (denNgay) {

        request.input(
            'denNgay',
            sql.Date,
            denNgay
        );

        whereClause += `
            AND SC.NgayGiao <= @denNgay
        `;
    }

    const result = await request.query(`

        SELECT

            SC.NgayGiao,

            DPH.NgayXo,

            DPH.DienGiai AS NoiVe,

            SC.MaDot,

            SUM(
                CASE
                    WHEN SC.Loai = 1
                    THEN SC.SoLuong
                    ELSE 0
                END
            ) AS SoCap,

            SUM(
                CASE
                    WHEN SC.Loai = 2
                    THEN SC.SoLuong
                    ELSE 0
                END
            ) AS SoE,

            SUM(
                CASE
                    WHEN SC.Loai = 1
                    THEN SC.SoLuong
                    ELSE -SC.SoLuong
                END
            ) AS ThucBan,

            MAX(SC.DonGia) AS DonGia,

            MAX(SC.TyLeThanhToan) AS TyLeThanhToan,

            SUM(
                CASE
                    WHEN SC.Loai = 1
                    THEN SC.ThanhTien
                    ELSE -SC.ThanhTien
                END
            ) AS ThanhTien

        FROM SoCai SC

        LEFT JOIN DotPhatHanh DPH
            ON SC.MaDot = DPH.MaDot

        ${whereClause}

        GROUP BY

            SC.NgayGiao,
            DPH.NgayXo,
            DPH.DienGiai,
            SC.MaDot

        ORDER BY

            SC.NgayGiao DESC,
            SC.MaDot ASC

    `);

    return result.recordset;
};

module.exports = {
    getBaoCaoByDoiTac
};