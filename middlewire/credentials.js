const whitelist = require("../config/AllowedOrigin");

const credentials = (req,res,next)=>{
    const origin = req.header.origin;
    if(whitelist.includes(origin)){
        res.header('Access-Control-Allow-Credentials',true);
    
    }
    next();
}

module.exports = credentials;