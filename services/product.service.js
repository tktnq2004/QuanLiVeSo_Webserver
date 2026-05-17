//const { sql } = require('../config/db');
//const model = require('../models/product.model');

//const create = async (data) => {

//    // check MA_CTY tồn tại
//    const check = await sql.query`
//        SELECT 1 FROM MA_CTY WHERE MA_CTY = ${data.MA_CTY}
//    `;

//    if (check.recordset.length === 0) {
//        throw new Error('MA_CTY không tồn tại');
//    }

//    return model.create(data);
//};

//const getAll = () => model.getAll();
//const getById = (id) => model.getById(id);
//const update = (id, data) => model.update(id, data);
//const remove = (id) => model.remove(id);

//module.exports = {
//    getAll,
//    getById,
//    create,
//    update,
//    remove
//};