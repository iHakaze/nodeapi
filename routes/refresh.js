const express = require("express");
const router = express.Router();
const refreshtokenController = require("../controller/refreshtokenController");
const path = require('path');

router.get('/',refreshtokenController.HandleRefreshToken);
/*router.get('^/$|/index(.html)?',(req,res)=>{
    //res.send('Hello world!');
    //res.sendFile("./views/index.html",{root: __dirname});
    //res.sendFile(path.join(__dirname,'..',"views","index.html"));
})*/
module.exports = router;