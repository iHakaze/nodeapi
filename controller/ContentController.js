const { dbconfig } = require("../config/dbconnect.js");
const mysql =require("mysql");
const fs = require('fs');
const path = require('path');
// Your other controller logic goes here
const fetchDataFromDatabase = async (req, res) => {
  try {
    const connection = mysql.createConnection(dbconfig);

    // Perform your queries or other operations here
    connection.query('select *,RANK() OVER(ORDER BY rate DESC) Rank from list order by rank', (error, results, fields) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
      
        res.status(200).json(results); // Send the results as JSON to the client
      }

      // Remember to close the connection when done
      connection.end((err) => {
        if (err) {
          console.error('Error closing the connection:', err);
        } else {
          console.log('Connection closed.');
        }
      });
    });
  } catch (err) {
    console.error('Error connecting to the database: ', err);
    res.status(500).send('Internal Server Error');
  }
};
const ViewAll = async (req,res)=>{
    try {
      const connection = mysql.createConnection(dbconfig);
      connection.query('select * from list order by id desc', (error, results, fields) => {
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
const create= async (req, res) => {
console.log('Uploaded file:', req.body);
console.log('Uploaded file:', req.file);
  try {
    const image = req.file.filename;
    const {title,chapter,remark,rate,link,desc} = req.body
    /*const newContent = {
      title: req.body.title,
      chapter: req.body.chapter,
      remake: req.body.
      
    }*/
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    if(!title || !chapter || !remark || !rate || !image || !desc){
      return res.status(400).json({'message':'Required All input!'})
    }
    const connection = mysql.createConnection(dbconfig);

    // Perform your queries or other operations here
    const q = "INSERT INTO list SET title = ?, chapter = ?, remark = ?, img = ?, link = ?, rate = ?,list_desc=?";
    const qParams = [title, chapter, remark, image, link, rate,desc];
    
    //console.log("Generated Query:", q);
    //console.log("Query Parameters:", qParams);

    connection.query(q,qParams,(error, results, fields) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        //console.log('Query results:', results);
        res.status(201).json({ "message":"Successfull",results}); // Send the results as JSON to the client
      }

      // Remember to close the connection when done
      connection.end((err) => {
        if (err) {
          console.error('Error closing the connection:', err);
        } else {
          console.log('Connection closed.');
        }
      });
    });
  } catch (err) {
    console.error('Error connecting to the database: ', err);
    res.status(500).send('Internal Server Error');
  }
};
// Get Info
const getContentOnce = async(req,res)=>{
  if(!req?.params?.id) return res.status(400).json({'message':`Content ID Required!`})
  let isgetID = req.params.id;
  try{
    const connection = mysql.createConnection(dbconfig);
    connection.query(`Select * from list where id=?`,[isgetID], (error, results, fields)=>{
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        //console.log(results);
        res.status(200).json(results); // Send the results as JSON to the client
      }

    });
    connection.end();
  }
  catch(error){
    console.error('Error connecting to the database: ', error);
  }
}

const UpdateContent = async (req,res)=>{
  if(!req?.body?.id){ return res.status(400).json({'message':`Content ID paramater Require!`})}
 
  try{
    const {title,chapter,remark,rate,link,desc,id} = req.body
    const image = req?.file?.filename ?? req?.body?.img;
    const connection = mysql.createConnection(dbconfig);
    const updateSql = 'UPDATE list SET title = ?, chapter = ?, remark = ?, img = ?, link = ?, list_desc= ?, rate = ? where id=?';
    // Your data to update
    const qParams = [title, chapter, remark, image, link, desc, rate,id];

      connection.query(updateSql,qParams,(error, results, fields) => {
        if (error) {
          console.error('Error executing query:', error);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('UPDATE Successfull');
          res.status(201).json({ "message":"Successfull",results}); // Send the results as JSON to the client
        }
      });
    
  
     // Remember to close the connection when done
    connection.end();
  }
  catch(error){
    console.error('Error connecting to the database: ', error);
  }

}
const Search = async (req,res)=>{
  if(!req?.body?.title) return res.status(400).json({'message':`Content Title Required!`})
  let isgetID = `%${req.body.title}%`;
  try{
    const connection = mysql.createConnection(dbconfig);
    connection.query(`Select * from list where title like ?`,[isgetID], (error, results, fields)=>{
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log("Search Done!");
        res.status(200).json(results); // Send the results as JSON to the client
      }

    });
    connection.end();
  }
  catch(error){
    console.error('Error connecting to the database: ', error);
  }

}
const viewrecent = async (req,res)=>{
  if(!req?.body?.ids) return res.status(400).json({'message':`Content ids Required!`})
  let isgetID = req.body.ids;
  try{
    const connection = mysql.createConnection(dbconfig);
    connection.query(`Select * from list where id in (?)`,[isgetID], (error, results, fields)=>{
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        console.log("Recent Data Fetched!");
        res.status(200).json(results); // Send the results as JSON to the client
      }

    });
    connection.end();
  }
  catch(error){
    console.error('Error connecting to the database: ', error);
  }

}
///Delete
const deleteContent = async (req,res)=>{
  if(!req?.body?.id){
    return res.status(400).json({'message':`Content ID paramater Require!`})
  }
  let isDeleteID = req.body.id;
  try {
    let filename="";
    const connection = mysql.createConnection(dbconfig);
    connection.query(`Select img from list where id=?`,[isDeleteID], (error, results, fields)=>{
        filename = results[0].img;
 
      const filePath = path.join(__dirname,"..","public","uploads",filename);
 
      if (fs.existsSync(filePath)) {
        // File exists, proceed with deletion
        try {
          fs.unlinkSync(filePath);
          console.log('The File Contains also deleted successfully');
        } catch (err) {
          //console.error(`Error deleting file: ${err}`);
        }
      } else {
        console.error('File does not exist');
      }
    });
    connection.query(`DELETE FROM list WHERE id=?`,[isDeleteID], (error, results, fields) => {
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
module.exports = {
  fetchDataFromDatabase, create ,ViewAll,deleteContent,getContentOnce,UpdateContent,Search,viewrecent
  // Other controller functions if needed
};