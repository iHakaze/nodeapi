const fs = require('fs');
const fspromise = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');
const { v4:uuid } = require('uuid');
//const { config } = require('process');

const logEvents = async (message,logname)=>{
    const datetime = `${format(new Date(),'yyyy-MM-dd\thh:mm:ss')}`;
    const logitems = `${datetime}\t${uuid()}\t${message}\n`;
    //console.log(logitems);
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fspromise.mkdir(path.join(__dirname,'..','logs'));
        }
        //testing
        await fspromise.appendFile(path.join(__dirname,'..','logs',logname),logitems);

    }catch(err){
        console.log(err);
    
    }
}

const logger = (req,res,next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqlog.txt')
   // console.log(req)
    console.log("EventLogger",`${req.method} ${req.path} ${req.headers.referer}`);
    next();

}
module.exports = {logger,logEvents};