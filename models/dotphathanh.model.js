const { sql } = require('../config/db');

const getActive = async () => {
    const query = `
                WITH TonVe AS
                (
                    SELECT
                        D.MaDot,
                        D.DienGiai,
                        D.NgayXo,
                        D.MaCap,

                        SoLuongCap =
                        CASE DATEPART(WEEKDAY, D.NgayXo)
                            WHEN 2 THEN C.Thu2
                            WHEN 3 THEN C.Thu3
                            WHEN 4 THEN C.Thu4
                            WHEN 5 THEN C.Thu5
                            WHEN 6 THEN C.Thu6
                            WHEN 7 THEN C.Thu7
                            WHEN 1 THEN C.CN
                        END,

                        SoLuongDaBan =
                        ISNULL(SUM(S.SoLuong),0)

                    FROM DotPhatHanh D

                    INNER JOIN CapVe C
                        ON C.MaCap = D.MaCap

                    LEFT JOIN SoCai S
                        ON S.MaDot = D.MaDot
                    AND S.Xoa = 0

                    WHERE D.NgayXo > CAST(GETDATE() AS DATE)

                    GROUP BY
                        D.MaDot,
                        D.DienGiai,
                        D.NgayXo,
                        D.MaCap,
                        C.Thu2,
                        C.Thu3,
                        C.Thu4,
                        C.Thu5,
                        C.Thu6,
                        C.Thu7,
                        C.CN
                )

                SELECT
                    *,
                    SoLuongConLai = SoLuongCap - SoLuongDaBan
                FROM TonVe
                WHERE (SoLuongCap - SoLuongDaBan) > 0
                ORDER BY NgayXo;

    `;
    const result = await sql.query(query);
    return result.recordset;
};

const getAll = async () => {
    const result = await sql.query`SELECT * FROM DotPhatHanh`;
    return result.recordset;
};

const getById = async (id) => {
    const result = await sql.query`SELECT * FROM DotPhatHanh WHERE MaDot = ${id}`;
    return result.recordset[0];
};

const create = async (data) => {
    const { MaDot, MaCap, NgayXo, MaKyXo, DienGiai } = data;
    await sql.query`
        INSERT INTO DotPhatHanh (MaDot, MaCap, NgayXo, MaKyXo, DienGiai)
        VALUES (${MaDot}, ${MaCap}, ${NgayXo}, ${MaKyXo}, ${DienGiai})
    `;
};

const update = async (id, data) => {
    const { MaCap, NgayXo, MaKyXo, DienGiai } = data;
    await sql.query`
        UPDATE DotPhatHanh
        SET MaCap = ${MaCap}, NgayXo = ${NgayXo}, MaKyXo = ${MaKyXo}, DienGiai = ${DienGiai}
        WHERE MaDot = ${id}
    `;
};

const remove = async (id) => {
    await sql.query`DELETE FROM DotPhatHanh WHERE MaDot = ${id}`;
};



module.exports = { getAll, getById, create, update, remove, getActive };