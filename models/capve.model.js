const { sql } = require('../config/db');

const getAll = async () => {
    const result = await sql.query`SELECT * FROM CapVe`;
    return result.recordset;
};

const getById = async (id) => {
    const result = await sql.query`SELECT * FROM CapVe WHERE MaCap = ${id}`;
    return result.recordset[0];
};

const create = async (data) => {
    const { MaCap, TenCap, MaCTXS, Thu2, Thu3, Thu4, Thu5, Thu6, Thu7, CN } = data;
    await sql.query`
        INSERT INTO CapVe (MaCap, TenCap, MaCTXS, Thu2, Thu3, Thu4, Thu5, Thu6, Thu7, CN)
        VALUES (${MaCap}, ${TenCap}, ${MaCTXS}, ${Thu2}, ${Thu3}, ${Thu4}, ${Thu5}, ${Thu6}, ${Thu7}, ${CN})
    `;
};

const update = async (id, data) => {
    const { TenCap, MaCTXS, Thu2, Thu3, Thu4, Thu5, Thu6, Thu7, CN } = data;
    await sql.query`
        UPDATE CapVe
        SET TenCap = ${TenCap}, MaCTXS = ${MaCTXS}, Thu2 = ${Thu2}, Thu3 = ${Thu3}, 
            Thu4 = ${Thu4}, Thu5 = ${Thu5}, Thu6 = ${Thu6}, Thu7 = ${Thu7}, CN = ${CN}
        WHERE MaCap = ${id}
    `;
};

const remove = async (id) => {
    await sql.query`DELETE FROM CapVe WHERE MaCap = ${id}`;
};

// src/models/capve.model.js

const getTicketPairsForSearch = async () => {
    const result = await sql.query`
        SELECT 
            cv.MaCap as id,
            ctxs.TenCTXS as TenDai,            
            cv.MaCTXS as MaDai,               
            cv.TenCap as LoaiVe,              
            100 as SoLuongCap,                
            ISNULL(cv.Thu2, 0) as Thu2,
            ISNULL(cv.Thu3, 0) as Thu3,
            ISNULL(cv.Thu4, 0) as Thu4,
            ISNULL(cv.Thu5, 0) as Thu5,
            ISNULL(cv.Thu6, 0) as Thu6,
            ISNULL(cv.Thu7, 0) as Thu7,
            ISNULL(cv.CN, 0) as ChuNhat        
        FROM CapVe cv
        INNER JOIN CongTyXoSo ctxs ON cv.MaCTXS = ctxs.MaCTXS
    `;
    return result.recordset;
};

module.exports = { getAll, getById, create, update, remove, getTicketPairsForSearch };