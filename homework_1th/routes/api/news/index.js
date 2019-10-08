var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/', require('./news.js'));
router.use('/like', require('./like'));

module.exports = router;

