let mysql = require('mysql');

const config = {
    // host: process.env.DB_HOST_SERVER,

    host: process.env.DB_HOST_VM,
    user: process.env.DB_USER_REAL_TIME,
    password: '',
    database: process.env.DB_NAME_REAL_TIME, //SaphTmpRMonaco
    port: '3306'
    // host: '192.168.56.104',
    // user: 'SaphTmpRServ',
    // password: '',
    // database: 'SaphTmpRMonaco', //SaphTmpRMonaco
    // port: '3306'
 }
 var connection = mysql.createConnection(config); //added the line
 connection.connect(function(err){
   if (err){
     console.log('error connecting:' + err.stack);
   }
   else
    console.log('connected successfully to DB.');
 });
 
 module.exports ={
      connection : mysql.createConnection(config) 
 } 
