var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/api', require('./api'));

router.get('/', function(req, res) {
  res.send("not supported");
});

module.exports = router;
