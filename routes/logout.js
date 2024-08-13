const express = require("express");
const router = express.Router();
const logoutController = require("../controller/logoutController");
const path = require('path');

router.get('/',logoutController.Handlelogout);

module.exports = router;