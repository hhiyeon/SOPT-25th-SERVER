var express = require('express');
var router = express.Router();

/* GET home page. */
router.use("/blogs", require("./blogs/index"));
router.use('/auth', require("./auth/index"))

module.exports = router;
