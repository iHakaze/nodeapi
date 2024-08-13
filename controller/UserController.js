const mysql =require("mysql");
const { dbconfig } = require("../config/dbconnect.js");
const bcrypt = require("bcrypt");

const handlerUser = async(req,res)=>{
    const {user, pwd, role} = req.body;
    console.log(role)
    if(!user || !pwd) return res.status(400).json({'message':'Username And Password are Required.'});
    //check for duplicate username in the db
    const connection = mysql.createConnection(dbconfig);

    const checkDuplicateUsername = (username) => {
        return new Promise((resolve, reject) => {
          connection.query('SELECT username FROM user WHERE username = ?', [username], (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          });
        });
      };
    const duplicate = await checkDuplicateUsername(user)
    //console.log(duplicate.length);
    if(duplicate.length > 0) return res.status(409).send({'message':`Username already exists!`}) // Conflict

    try{
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd,10);
        const DefaultRole = !role ? 1999 : role;
        const filterrole = role == 2000 ? "Admin" : "User";
        //store user
        connection.query('insert into user SET username=?,password=?,role=?',[user,hashedPwd,DefaultRole],(error, results, fields) => {
            if (error) {
              console.error('Error executing query:', error);
              res.status(500).send('Internal Server Error');
            } else {
              res.status(201).json({'message':`New ${filterrole} ${user} Created!`});
              //res.status(200).json(results); // Send the results as JSON to the client
            }
        })

      
       
    connection.end();
    }catch (err){
        res.status(500).json({'message': err.message});
        console.log(err);
    }
}
const updateuser = async(req,res) =>{
  if(!req?.body?.id){ return res.status(400).json({'message':`Content ID paramater Require!`})}
  try {
    const {user,pass,role,id} = req.body
    const hashedPwd = await bcrypt.hash(pass,10);
    const connection = mysql.createConnection(dbconfig);
    let updateSql = "";

    let qParams = [];

    if(pass){
       updateSql = 'UPDATE user SET username = ?, password = ?, role = ? where id=?';
       qParams = [user,hashedPwd,role,id];
    }
    else{
        updateSql =  'UPDATE user SET username = ?, role = ? where id=?';
        qParams = [user,role,id];

    }
  
    // Your data to update
      connection.query(updateSql,qParams,(error, results, fields) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('UPDATE Successfull');
          res.status(201).json({ "message":"Update Successfull",results}); // Send the results as JSON to the client
        }
      });
    
  
     // Remember to close the connection when done
    connection.end();
    
  } catch (error) {
    console.error('Error connecting to the database: ', error);
    
  }

}
const getuser = async(req,res)=>{
  if(!req?.params?.id){ return res.status(400).json({'message':`User ID paramater Require!`})}
  let isgetID = req.params.id;
  try {
    const connection = mysql.createConnection(dbconfig);
    connection.query(`Select id as id,username as user,password as pass,role as role from user where id=?`,[isgetID], (error, results, fields)=>{
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log(results[0].user);
        res.status(200).json(results); // Send the results as JSON to the client
      }

    });
    connection.end();
    
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }


}
const showuser = async(req,res)=>{
  try {
    const connection = mysql.createConnection(dbconfig);
    connection.query('select * from user order by id desc', (error, results, fields) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Internal Server Error');
        } else {
      
          res.status(200).json(results); // Send the results as JSON to the client
        }
    })
    connection.end();
  } catch (err) {
    console.error('Error connecting to the database: ', err);
    res.status(500).send('Internal Server Error');
  }

}
///Delete
const deleteContent = async (req,res)=>{
  if(!req?.body?.id){
    return res.status(400).json({'message':`Content ID paramater Require!`})
  }
  let isDeleteID = req.body.id;
  try {
    const connection = mysql.createConnection(dbconfig);

    connection.query(`DELETE FROM user WHERE id=?`,[isDeleteID], (error, results, fields) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Internal Server Error');
        } else {
          //console.log(results);

          res.status(200).json(results); // Send the results as JSON to the client
        }
    });
    connection.end();
  } catch (err) {
    console.error('Error connecting to the database: ', err);
    res.status(500).send('Internal Server Error');
  }

}

module.exports = {handlerUser,showuser,deleteContent,getuser,updateuser};