const mysql = require('mysql');
const bcrypt = require('bcrypt');
const {dbconfig} = require('../config/dbconnect');
const jwt = require('jsonwebtoken');

const HandleLogin = async (req, res)=>{
    const {user, pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({'message':'Username And Password are Required.'});
    const connection = mysql.createConnection(dbconfig);
    const checkeUsername = (username) => {
        return new Promise((resolve, reject) => {
          connection.query('SELECT * FROM user WHERE username = ?', [username], (error, results) => {
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
    const Founduser = await checkeUsername(user);
    console.log(Founduser);
    if(!Founduser || Founduser ==0) return res.sendStatus(401)// unauthorized;
   
    const match = await bcrypt.compare(pwd,Founduser[0].password);
    if(match){
      const accessToken = jwt.sign(
        {
            "Userinfo": {
                "username":Founduser[0].username,
                "role":Founduser[0].role
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'1hr'}   
      )
      const refreshToken = jwt.sign(
        {"username":Founduser[0].username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'1d'}
      )
      
      // Your data to update
      const UpdateToken = await updateuserToken(refreshToken,Founduser[0].id);
      console.log(refreshToken)
      //res.cookie('jwt',refreshToken,{httpOnly:true,maxAge: 24 * 60 * 60 * 1000}); // add this if using chrome or actual production secure: true
      res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None',secure:true,maxAge: 24 * 60 * 60 * 1000}); // add this if using chrome or actual production secure: true
      res.json({user:Founduser[0].username,accessToken})
    }
    else{
        res.sendStatus(401);
    }
    connection.end();
}
module.exports = HandleLogin;