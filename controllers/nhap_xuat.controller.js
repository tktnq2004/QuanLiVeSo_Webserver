<<<<<<< HEAD
const service = require('../services/nhap_xuat.service');

const create = async (req, res) => {
    try {
        await service.create(req.body);
        res.send('Created');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getAll = async (req, res) => {
    const data = await service.getAll();
    res.json(data);
};

module.exports = {
    create,
    getAll
};
=======
//const service = require('../services/nhap_xuat.service');

//const create = async (req, res) => {
//    try {
//        await service.create(req.body);
//        res.send('Created');
//    } catch (err) {
//        res.status(400).json({ message: err.message });
//    }
//};

//const getAll = async (req, res) => {
//    const data = await service.getAll();
//    res.json(data);
//};

//module.exports = {
//    create,
//    getAll
//};
>>>>>>> 5713a527af9832d0fcfcba16eb301caf1bea331a
