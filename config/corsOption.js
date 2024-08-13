const whitelist = require("./AllowedOrigin");
const corsOptions ={
    origin: (origin,callback)=>{
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true);
        }else{
            callback(new Error("Not allowed By Corse"));
        }
    },
    optionSuccessStatus: 200,
    credentials: true,


}

module.exports = corsOptions;