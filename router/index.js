const express = require('express');
let router = express.Router();
const controls = require('../controllers/indexController');


router.get('/', controls.home);
router.get('/join/:id', controls.join);
router.get('/404', controls.notFound);

module.exports = router;
