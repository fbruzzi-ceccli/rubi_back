let mysql = require('mysql');

const config = {
    // host: process.env.DB_HOST_SERVER,

    host: process.env.DB_HOST_VM,
    user: process.env.DB_USER,
    password: '',
    database: process.env.DB_NAME, //SaphRefrAntibes
    port: '3306'
    // host: '192.168.56.104',
    // user: 'SaphRefrServ',
    // password: '',
    // database: 'SaphRefrMonaco', //SaphRefrAntibes
    // port: '3306'
 }
 var connection = mysql.createConnection(config); //added the line
 connection.connect(function(err) {
   if (err){
     console.log('error connecting:' + err.stack);
   }
   else
    console.log('connected successfully to DB.');
 });
 
 module.exports ={
      connection : mysql.createConnection(config) 
 } 
