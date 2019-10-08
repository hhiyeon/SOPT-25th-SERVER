var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/', require('./blog'));

module.exports = router;
