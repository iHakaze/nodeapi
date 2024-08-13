require('dotenv').config();
const express  = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql')
const fs = require('fs').promises;
const {dbconfig} = require("./config/dbconnect.js")
const { logger } = require("./middlewire/LogEvents");
const cors = require("cors")
const corsOptions = require("./config/corsOption.js")
const cookieParser = require("cookie-parser");
const credentials = require("./middlewire/credentials.js")

const PORT = process.env.PORT || 3000

const connection =  mysql.createConnection(dbconfig);

app.use(logger);
//handle option credentials check - before CORS
// and fetch cookies credential requirement
app.use(credentials);

// Cors = Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({extended:false}));

//built-in middleware for json
app.use(express.json());

//middleware  for cookie
app.use(cookieParser());

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'public','uploads')));


app.use('/content',require('./routes/api/content.js'));
app.use('/register',require('./routes/api/user.js'));
app.use('/auth',require('./routes/auth.js'));
app.use('/refresh',require('./routes/refresh.js'));
app.use('/logout',require('./routes/logout.js'));

app.all('*',(req,res)=>{
    res.sendStatus(404)
  
})
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
connection.connect(function (err) {
    if(!err){
      console.log('Connected to MySQL database!');
      app.listen(PORT,()=>{
        console.log(`Server is On LocalHost: ${PORT}`, path.join(__dirname));
        });
      //connection.end();
    }
    else{
     console.error('Error connecting to the database: ', err);
      //console.log(err);
    }
 });
