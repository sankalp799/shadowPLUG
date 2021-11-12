const express = require('express');
let router = express.Router();
const controls = require('../controllers/indexController');
const bodyParser = require('body-parser');
let formBodyParser = bodyParser.urlencoded({ extended:true });

router.get('/', controls.home);
router.get('/join/:id', controls.join);
router.get('/404', controls.notFound);
router.post('/:id', formBodyParser, controls.getRoom);
router.get('/:id', controls.directRoom);

module.exports = router;
