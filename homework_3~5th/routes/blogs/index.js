var express = require('express');
var router = express.Router();

router.use("/", require("./blog"));
router.use("/articles", require("./articles/index"));

module.exports = router;