const { dbconfig } = require("../config/dbconnect.js");
const mysql =require("mysql");   
const jwt = require('jsonwebtoken');


const HandleRefreshToken = async(req,res)=>{
        const cookies = req.cookies;
    //console.log(cookies)
        if(!cookies?.jwt) return res.sendStatus(401);
    
        const refreshToken = cookies.jwt;
        const connection = mysql.createConnection(dbconfig);

        const checkRefreshToken = (refreshToken) => {
            return new Promise((resolve, reject) => {
              connection.query('SELECT * FROM user WHERE refreshToken = ?', [refreshToken], (error, results) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(results);
                }
              });
            });
          };
        const Founduser = await checkRefreshToken(refreshToken);
        if(!Founduser || Founduser ==0) return res.sendStatus(403)// Forbidden
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err,decoded)=>{
                    //console.log(decoded.username);
                    if(err || Founduser[0].username !== decoded.username) return res.sendStatus(403) // forbidden
                    const role = Founduser[0].role;
                    //create JWTs
                    const accessToken = jwt.sign(
                        {
                            "Userinfo": {
                                "username":decoded.username,
                                "role": role
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn:'1h'}
                    );
                
                    res.json({user:Founduser[0].username,accessToken });
                }
               
            );
            connection.end();
}
module.exports = {HandleRefreshToken};