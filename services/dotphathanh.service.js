const model = require('../models/dotphathanh.model');

// dotphathanh.service.js
const getActive = async () => {
    try {
        console.log(">>> [DEBUG SERVICE] Bắt đầu gọi model.getActive...");

        const data = await model.getActive();

        // Kiểm tra ngay tại đây
        console.log(">>> [DEBUG SERVICE] Dữ liệu từ Model trả về:", JSON.stringify(data, null, 2));

        if (!data) {
            console.warn(">>> [DEBUG SERVICE] Dữ liệu từ model là NULL/UNDEFINED");
            return []; // Trả về mảng rỗng để không làm crash controller
        }

        return data;
    } catch (error) {
        console.error(">>> [DEBUG SERVICE] Lỗi khi gọi model:", error);
        throw error; // Đẩy lỗi ra cho controller xử lý
    }
};
const getAll = () => model.getAll();
const getById = (id) => model.getById(id);
const create = (data) => model.create(data);
const update = (id, data) => model.update(id, data);
const remove = (id) => model.remove(id);


module.exports = { getAll, getById, create, update, remove, getActive };