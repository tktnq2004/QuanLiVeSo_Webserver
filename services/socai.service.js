const ExcelJS = require('exceljs');
const model = require('../models/socai.model');

const getBaoCaoByDoiTac = (maDoiTac, tuNgay, denNgay) => model.getBaoCaoByDoiTac(maDoiTac, tuNgay, denNgay);

const getAll = () => model.getAll();

const getAllMobile = () => model.getAllMobile();

const getSoCaiMeta = () => model.getMeta();

const getDonGiaSoCai = (params) =>
    model.getDonGia(params.MaDot, params.Loai, params.LoaiChiTiet);

const getPaymentsForSearch = (search) => model.getPaymentsForSearch(search);


const getDynamicAnalytics = (filters) => model.getDynamicAnalytics(filters);
const getAnalyticsFilters = () => model.getAnalyticsFilters();

const applyHeaderStyle = (row) => {
    row.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial', size: 11 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });
    row.height = 22;
};

const applyDataStyle = (row, isEven) => {
    row.eachCell(cell => {
        cell.font = { name: 'Arial', size: 10 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isEven ? 'FFF0F4FA' : 'FFFFFFFF' } };
        cell.border = { top: { style: 'hair' }, bottom: { style: 'hair' }, left: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle' };
    });
    row.height = 18;
};

const applyTotalStyle = (row) => {
    row.eachCell(cell => {
        cell.font = { bold: true, name: 'Arial', size: 10, color: { argb: 'FF1E3A5F' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCE6F1' } };
        cell.border = { top: { style: 'medium' }, bottom: { style: 'double' }, left: { style: 'thin' }, right: { style: 'thin' } };
    });
    row.height = 20;
};

// tính tổng từ JS — tránh lỗi formula khi data rỗng
const sumCol = (data, key) =>
    data.reduce((s, r) => s + (Number(r[key]) || 0), 0);

// ── build info rows (title + kỳ + ngày tạo/người tạo) ───────────
const buildInfoRows = (ws, title, subTitle, ngayTao, nguoiTao, colCount) => {
    // row 1: tiêu đề
    ws.mergeCells(1, 1, 1, colCount);
    const r1 = ws.getRow(1);
    r1.getCell(1).value = title;
    r1.getCell(1).font = { bold: true, size: 14, name: 'Arial', color: { argb: 'FF1E3A5F' } };
    r1.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
    r1.height = 32;

    // row 2: kỳ báo cáo
    ws.mergeCells(2, 1, 2, colCount);
    const r2 = ws.getRow(2);
    r2.getCell(1).value = subTitle;
    r2.getCell(1).font = { italic: true, size: 11, name: 'Arial', color: { argb: 'FF1E3A5F' } };
    r2.getCell(1).alignment = { horizontal: 'center' };
    r2.height = 20;

    // row 3: ngày tạo (trái) + người tạo (phải)
    const half = Math.floor(colCount / 2);
    ws.mergeCells(3, 1, 3, half);
    ws.getRow(3).getCell(1).value = `Ngày tạo: ${ngayTao}`;
    ws.getRow(3).getCell(1).font = { size: 9, italic: true, name: 'Arial', color: { argb: 'FF888888' } };

    ws.mergeCells(3, half + 1, 3, colCount);
    ws.getRow(3).getCell(half + 1).value = `Người tạo: ${nguoiTao}`;
    ws.getRow(3).getCell(half + 1).font = { size: 9, italic: true, name: 'Arial', color: { argb: 'FF888888' } };
    ws.getRow(3).getCell(half + 1).alignment = { horizontal: 'right' };
    ws.getRow(3).height = 16;

    // row 4: blank
    ws.addRow([]);
};

// ── main ─────────────────────────────────────────────────────────

const xuatExcelThang = async (thang, nam, nguoiTao = 'Hệ thống') => {
    const [doiTacData, dotData] = await Promise.all([
        model.getBaoCaoDoiTacThang(thang, nam),
        model.getBaoCaoDotThang(thang, nam),
    ]);

    const wb = new ExcelJS.Workbook();
    wb.creator = 'QuanLyVeSo';
    wb.created = new Date();

    const subTitle = `Tháng ${String(thang).padStart(2, '0')} / ${nam}`;
    const numFmt = '#,##0';
    const ngayTao = new Date().toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

    // ════════════════════════════════════════════════════
    // SHEET 1 — THEO ĐỐI TÁC
    // ════════════════════════════════════════════════════
    const ws1 = wb.addWorksheet('Theo Đối Tác');
    ws1.columns = [
        { width: 6 }, // STT
        { width: 14 }, // Mã ĐT
        { width: 28 }, // Tên đối tác
        { width: 18 }, // Nhóm
        { width: 12 }, // Tổng giao
        { width: 12 }, // Tổng trả
        { width: 12 }, // Thực bán
        { width: 18 }, // Doanh thu
        { width: 18 }, // Đã trả
        { width: 18 }, // Còn nợ
    ];

    buildInfoRows(ws1, 'BÁO CÁO DOANH THU THEO ĐỐI TÁC', subTitle, ngayTao, nguoiTao, 10);

    // row 5: header
    applyHeaderStyle(ws1.addRow([
        'STT', 'Mã ĐT', 'Tên đối tác', 'Nhóm',
        'Tổng giao', 'Tổng trả', 'Thực bán',
        'Doanh thu', 'Đã trả', 'Còn nợ',
    ]));

    // row 6+: data
    doiTacData.forEach((r, i) => {
        const row = ws1.addRow([
            i + 1,
            r.MaDoiTac,
            r.TenDoiTac,
            r.TenNhom || '',
            r.TongGiao || 0,
            r.TongTra || 0,
            r.ThucBan || 0,
            r.DoanhThu || 0,
            r.DaTra || 0,
            r.ConNo || 0,
        ]);
        applyDataStyle(row, i % 2 === 1);
        [5, 6, 7, 8, 9, 10].forEach(c => {
            row.getCell(c).numFmt = numFmt;
            row.getCell(c).alignment = { horizontal: 'right', vertical: 'middle' };
        });
        if ((r.ConNo || 0) > 0)
            row.getCell(10).font = { bold: true, color: { argb: 'FFCC0000' }, name: 'Arial', size: 10 };
    });

    // dòng tổng — giá trị JS, không dùng formula
    const tot1 = ws1.addRow([
        '', '', 'TỔNG CỘNG', '',
        sumCol(doiTacData, 'TongGiao'),
        sumCol(doiTacData, 'TongTra'),
        sumCol(doiTacData, 'ThucBan'),
        sumCol(doiTacData, 'DoanhThu'),
        sumCol(doiTacData, 'DaTra'),
        sumCol(doiTacData, 'ConNo'),
    ]);
    applyTotalStyle(tot1);
    [5, 6, 7, 8, 9, 10].forEach(c => {
        tot1.getCell(c).numFmt = numFmt;
        tot1.getCell(c).alignment = { horizontal: 'right', vertical: 'middle' };
    });

    ws1.views = [{ state: 'frozen', ySplit: 5 }];

    // ════════════════════════════════════════════════════
    // SHEET 2 — THEO ĐỢT PHÁT HÀNH
    // ════════════════════════════════════════════════════
    const ws2 = wb.addWorksheet('Theo Đợt Phát Hành');
    ws2.columns = [
        { width: 6 }, // STT
        { width: 14 }, // Mã đợt
        { width: 30 }, // Tên đợt
        { width: 14 }, // Ngày xổ
        { width: 12 }, // Tổng giao
        { width: 12 }, // Tổng trả
        { width: 12 }, // Thực bán
        { width: 14 }, // Đơn giá
        { width: 18 }, // Doanh thu
    ];

    buildInfoRows(ws2, 'BÁO CÁO DOANH THU THEO ĐỢT PHÁT HÀNH', subTitle, ngayTao, nguoiTao, 9);

    applyHeaderStyle(ws2.addRow([
        'STT', 'Mã đợt', 'Tên đợt', 'Ngày xổ',
        'Tổng giao', 'Tổng trả', 'Thực bán',
        'Đơn giá', 'Doanh thu',
    ]));

    dotData.forEach((r, i) => {
        const row = ws2.addRow([
            i + 1,
            r.MaDot,
            r.TenDot,
            r.NgayXo ? new Date(r.NgayXo).toLocaleDateString('vi-VN') : '',
            r.TongGiao || 0,
            r.TongTra || 0,
            r.ThucBan || 0,
            r.DonGia || 0,
            r.DoanhThu || 0,
        ]);
        applyDataStyle(row, i % 2 === 1);
        [5, 6, 7, 8, 9].forEach(c => {
            row.getCell(c).numFmt = numFmt;
            row.getCell(c).alignment = { horizontal: 'right', vertical: 'middle' };
        });
    });

    const tot2 = ws2.addRow([
        '', '', 'TỔNG CỘNG', '',
        sumCol(dotData, 'TongGiao'),
        sumCol(dotData, 'TongTra'),
        sumCol(dotData, 'ThucBan'),
        '',
        sumCol(dotData, 'DoanhThu'),
    ]);
    applyTotalStyle(tot2);
    [5, 6, 7, 8, 9].forEach(c => {
        tot2.getCell(c).numFmt = numFmt;
        tot2.getCell(c).alignment = { horizontal: 'right', vertical: 'middle' };
    });

    ws2.views = [{ state: 'frozen', ySplit: 5 }];

    const buffer = await wb.xlsx.writeBuffer();
    const base64 = buffer.toString('base64');
    const fileName = `BaoCao_T${String(thang).padStart(2, '0')}_${nam}.xlsx`;

    return { base64, fileName };
};


module.exports = {
    getBaoCaoByDoiTac,
    getAll,
    getAllMobile,
    getSoCaiMeta,
    getDonGiaSoCai,
    getPaymentsForSearch,
    getDynamicAnalytics,
    getAnalyticsFilters,
    xuatExcelThang
};