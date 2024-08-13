const { dbconfig } = require("../config/dbconnect.js");
const mysql =require("mysql");   

const Handlelogout = async(req,res)=>{
    //on client, also delete the accessToken
    const cookies = req.cookies;
   
    if(!cookies?.jwt) return res.sendStatus(204); //successfull
    const connection = mysql.createConnection(dbconfig);
    //console.log(cookies.jwt)
    const refreshToken = cookies.jwt;
    
    //is refreshToken in db
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
      const updateuserToken = (refreshToken,id) => {
        return new Promise((resolve, reject) => {
          const updateSql = 'UPDATE user SET refreshToken = ? where id=?';
          connection.query(updateSql, [refreshToken,id], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });
      };
    const Founduser = await checkRefreshToken(refreshToken);
   // console.log(Founduser)
    if(!Founduser || Founduser == 0) {
     
        res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true})
        return res.sendStatus(204);
    } 
    //delete refreshToken in db
    const removerefreshToken = '';
    const result = await  updateuserToken(removerefreshToken,Founduser[0].id)
   // console.log(result);
    
    res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true});// secure : true - only  servers on https
    res.sendStatus(204);

}
module.exports = {Handlelogout};