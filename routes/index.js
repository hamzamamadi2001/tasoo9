var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
const { Server } = require("socket.io");
var con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",database:"final-year"
});
const io = new Server({ /* options */ });
let allusers=[]
io.on("connection", (socket) => {
allusers.push(socket.otherid)

  console.log("new user connected")


socket.on("hi",(messageinfo)=>{
   console.log("the buffer is "+messageinfo)
   console.log("hello dsaklf_______________________________________________________________________________________________")
  let query="INSERT INTO  messages  ( message,id_sender,id_reciver,is_photo ) VALUES (?,?,?,?)"
   con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
    con.query(query,messageinfo, function (error, results, fields) {
    if (error) throw error;
    console.log("_____________all think ok_____________");
    
      
    socket.emit("ok",messageinfo)
    
  

    }


   ) });
})
io.emit("chat","hello this is from the server")
})

io.listen(3001);








/*
var con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",database:"hamza"
});

 GET home page. 
router.get('/', function(req, res, next) {



    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query('SELECT * FROM messages', function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.status(200).send(results)


    });
  })

});*/

module.exports = router;
