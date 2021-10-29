const express = require('express');
const controls = require('../controllers/roomController');
let router = express.Router();

router.post('/create', controls.create);

module.exports = router;
