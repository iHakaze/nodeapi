const mysql = require('mysql');

const dbconfig={
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS ,
    database: process.env.DB_NAME
  }
  //console.log(dbconfig);

  
  const ConnectDB = () => {

      const connection =  mysql.createConnection(dbconfig);
      connection.connect(function (err) {
        if(!err){
          console.log('Connected to MySQL database!');
          //connection.end();
        }
        else{
         // console.error('Error connecting to the database: ', err);
          console.log(err.sqlMessage);
        }
     });
  };
  
module.exports = {ConnectDB, dbconfig};