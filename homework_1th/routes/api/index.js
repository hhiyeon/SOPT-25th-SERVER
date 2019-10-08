var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/cafe', require('./cafe'));
router.use('/blog', require('./blog'));
router.use('/news', require('./news'));

router.get('/', function(req, res) {
    res.send("not supported");
});

module.exports = router;

