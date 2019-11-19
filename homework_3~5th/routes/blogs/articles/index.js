var express = require('express');
var router = express.Router();

router.use("/", require("./article"));
router.use("/comments", require("./comments/index"));

module.exports = router;