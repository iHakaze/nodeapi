const express = require("express");
const router  = express.Router();
const AuthController = require('../controller/AuthController');


router.route("/").post(AuthController);
module.exports= router;