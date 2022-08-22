let mysql = require('mysql');

const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rubis',
    // port: '3308'
 }
 var connection = mysql.createConnection(config); //added the line
 connection.connect(function(err){
   if (err){
     console.log('error connecting:' + err.stack);
   }
   else
    console.log('connected successfully to local DB.');
 });
 
 module.exports ={
      connection : mysql.createConnection(config) 
 } 
