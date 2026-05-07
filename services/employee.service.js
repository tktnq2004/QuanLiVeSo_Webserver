const { sql } = require('../config/db');
const model = require('../models/employee.model');

const create = async (data) => {

    // check nghề tồn tại
    const check = await sql.query`
        SELECT 1 FROM MA_NGHE WHERE MA_NGHE = ${data.MA_NGHE}
    `;

    if (check.recordset.length === 0) {
        throw new Error('MA_NGHE không tồn tại');
    }

    return model.create(data);
};

const getAll = () => model.getAll();
const getById = (id) => model.getById(id);
const update = (id, data) => model.update(id, data);
const remove = (id) => model.remove(id);

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};