 var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var mysql = require('mysql2');

var indexRouter = require('./routes/index');
const { Server } = require("socket.io");
const { response, query } = require('express');
var con = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "admin",database:"final-year"
});


var app = express();

 

 app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
 app.use('/', indexRouter);
app.listen(process.env.PORT||3000,()=>{
  console.log("haho al server")
})

app.get("/init_chat/",(req,res)=>{
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query('SELECT * FROM messages', function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.status(200).send(results)
        console.log("ok done")
  
  
      });
    })

})

app.get("/list_of_users",(req,res)=>{


  console.log("lk;lkl;")
const name =req.params.name


  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('SELECT * FROM messages', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.status(200).send(results)
    console.log("ok done")


  });
})
   

})


app.post("/register_new_user/",(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const phone=req.body.phone;
  const wilaya=req.body.wilaya;
  const type_of_user=req.body.type_of_user;
  console.log(username,password,phone,wilaya,type_of_user)

  
   
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT id_user FROM users WHERE phone=?",[phone],function (error, results, fields) {
      if (results.length!=0){
          console.log(results)
        res.status(404).send({
                 status:2,
                    })
    }else{
         con.query('INSERT INTO `users`(`username`, `password`, `phone`, `province`, `type_of_user`, `is_active`,`profile_img`,background_img) VALUES (?,?,?,?,?,?,?,?)',[username,password,phone,wilaya,type_of_user,true,"https://res.cloudinary.com/my-online-store/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1652041398/user_yqp4gh.png","https://res.cloudinary.com/my-online-store/image/upload/v1652342438/background_reh1td.jpg"], function (error, results, fields) {
          con.query("SELECT id_user FROM users WHERE phone=?",[phone],function (error, results, fields) {
                if (error){
                     res.status(404).send({
                      status:0
                 })
                           }
    console.log(results)
   
    res.status(200).send({
      id:results[0].id,
status:1    })
    console.log("ok done")
    })
    
   
    


  })




    }
  
   
    
    console.log("ok done")
    })
   
}

)






})



app.get("/list_of_product_name",(req,res)=>{
   
 

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('SELECT id_product , product FROM products ', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.status(200).send(results)
    console.log("ok done")


  });
})







   

})



app.post("/rating_product",(req,res)=>{
   
 
  
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query('INSERT INTO `rates`(  `id_user`, `id_offer`, `value_of_rate`) VALUES (?,?,?) ',[req.body.id_user,req.body.id_offer,req.body.rate], function (error, results, fields) {

    con.query('SELECT value_of_rate FROM rates WHERE rates.id_offer=? ',[req.body.id_offer ] ,function (error, results2, fields) {

    let sum=0
    if(results2!=0){
       
    for (let index = 0; index < results2.length; index++) {
    sum=sum+results2[index].value_of_rate
      
    }
     }
   

con.query('UPDATE `offers` SET `total_rate`=? , number_of_person=? WHERE  offers.id_offer=? ',[Math.trunc(sum/results2.length),results2.length,req.body.id_offer], function (error, results, fields) {
        
        
         if (error) throw error;
      console.log(results);
      res.status(200).send(results)
      console.log("ok done")
        
      })





        
    })
        

      


     
  
  
    });
  })
  
  
  
  
  
  
  
     
  
  })











app.post("/login",(req,res)=>{
  const phone=req.body.phone;
  const password=req.body.password;
  console.log(password,phone)
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('SELECT * FROM users WHERE phone=? and password=?',[phone,password], function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    if(results.length==1){
       res.status(200).send({
         id:results[0].id_user,
         type:results[0].type_of_user,

      status:1,
      
    })
    }else{
      res.status(200).send({
        status:-1,
        
      })


    }
   
    console.log("ok done")


  });
})





   

})




app.get("/get_info_farmer",(req,res)=>{


  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('SELECT * FROM ', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.status(200).send(results)
    console.log("ok done")


  });
})



})

app.get("/best_offers",(req,res)=>{
  console.log("--------------------------------------------------------------------------------------------")

   con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('SELECT * FROM offers,users,products WHERE offers.total_rate>=3 AND offers.id_product=products.id_product AND offers.id_farmer=users.id_user ', function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    res.status(200).send(results)
    console.log("ok done")


  });
})



})






   


app.post("/send_request",(req,res)=>{

console.log(req.body)
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('INSERT INTO `requests`(`id_offer`, `id_user`,`date_request`, `time_request`) VALUES (?,?,?,?,?,?)',[req.body.sug_price,req.body.sug_quantity,req.body.id_offer,req.body.id_user,req.body.date,req.body.time], function (error, results, fields) {
if (error) throw error;
    console.log(results);
    res.status(200).send(results)
    console.log("ok done")


    


 }) });})



 app.post("/get_info_farmer",(req,res)=>{

  console.log(req.body)
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query('SELECT username,phone,province,type_of_user,is_active,profile_img,background_img FROM `users` WHERE users.id_user=?',[req.body.id], function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.status(200).send(results)
      console.log("ok done")
  
  
   }) });})




app.post("/add_favorate",(req,res)=>{

  console.log(req.body)
    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query('INSERT INTO `favorates`( `id_user`, `id_offer`) VALUES (?,?)',[req.body.id_user,req.body.id_offer], function (error, results, fields) {
      if (error) throw error;
      console.log("i am in add");
      res.status(200).send(results)
      console.log("ok done")
  
  
   }) });})





   app.post("/get",(req,res)=>{
console.log("jkhjkhj")
    console.log(req.body)
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query('SELECT * FROM favorates,offers,products WHERE favorates.id_user=? AND favorates.id_offer=offers.id_offer AND offers.id_product=products.id_product' ,[req.body.id_user], function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.status(200).send(results)
        console.log("ok done",results)
    
    
     }) });})



     app.post("/get_request_farmer",(req,res)=>{
      console.log("jkhjkhj")
          console.log(req.body)
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              con.query('SELECT sug_price,status_req,requests.id,sug_quantity,date_request,time_request,username,product,phone,profile_img,requests.id_offer FROM requests,offers,products,users WHERE offers.id_farmer=? AND offers.id_offer=requests.id_offer AND requests.id_user=users.id_user AND offers.id_product=products.id_product AND requests.status_req="تم ارسال طلبك بنجاح"' ,[req.body.id_user], function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              res.status(200).send(results)
              console.log("ok done",results)
          
          
           }) });})





           app.post("/list_of_request_search_farmer",(req,res)=>{
            console.log("jkhjkhj")
                console.log(req.body)
                  con.connect(function(err) {
                    if (err) throw err;
                    console.log("Connected!");
                    con.query('SELECT sug_price,status_req,requests.id,sug_quantity,date_request,time_request,username,product,phone,profile_img,requests.id_offer FROM requests,offers,products,users WHERE offers.id_farmer=? AND offers.id_offer=requests.id_offer AND requests.id_user=users.id_user AND offers.id_product=products.id_product AND requests.status_req="تم ارسال طلبك بنجاح" AND products.product LIKE ?' ,[req.body.id_user,"%"+req.body.name+"%"], function (error, results, fields) {
                    if (error) throw error;
                    console.log(results);
                    res.status(200).send(results)
                    console.log("ok done",results)
                
                
                 }) });})





     app.post("/get_request_client",(req,res)=>{
      console.log("jkhjkhj")
          console.log(req.body)
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              con.query('SELECT  `status_req`,id, `date_request`, requests.id_offer, `time_request`,product FROM products,offers,`requests` WHERE requests.id_user=? AND offers.id_offer=requests.id_offer AND offers.id_product=products.id_product' ,[req.body.id_user], function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              res.status(200).send(results)
              console.log("ok done",results)
          
          
           }) });})









     app.post("/delete_request",(req,res)=>{
           console.log(req.body)
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              con.query('DELETE FROM `requests` WHERE requests.id=?' ,[req.body.id_request], function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              res.status(200).send(results)
              console.log("ok done",results)
          
          
           }) });})







     app.post("/get_request_admin",(req,res)=>{
      console.log("jkhjkhj")
          console.log(req.body)
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              con.query('SELECT * FROM `offers`,products,users WHERE status_offer="قيد المعالجة"AND products.id_product=offers.id_product AND users.id_user=offers.id_farmer ', function (error, results, fields) {
                if (error) throw error;
              console.log(results);
              res.status(200).send(results)
              console.log("ok done",results)
          
          
           }) });})




           





     app.post("/list_of_request_search_client",(req,res)=>{
      console.log("jkhjkhj")
          console.log(req.body)
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              con.query('SELECT  `status_req`,id, `date_request`, requests.id_offer, `time_request`,product FROM products,offers,`requests` WHERE requests.id_user=? AND offers.id_offer=requests.id_offer AND offers.id_product=products.id_product AND products.product LIKE ?' ,[req.body.id_user,"%"+req.body.name+"%"], function (error, results, fields) {
                if (error) throw error;
              console.log(results);
              res.status(200).send(results)
              console.log("ok done",results)
          
          
           }) });})




   app.post("/delete_favorate",(req,res)=>{
console.log("iam in the delete api")
    console.log(req.body)
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        con.query('DELETE FROM `favorates` WHERE favorates.id_user=? AND favorates.id_offer=?',[req.body.id_user,req.body.id_offer], function (error, results, fields) {
        if (error) throw error;
        console.log("i am in delete");
        res.status(200).send(results)
        console.log("ok done")
    
    
     }) });})














     app.post("/update_request",(req,res)=>{
      console.log("iam in the request api")
          console.log(req.body)
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              con.query('UPDATE `requests` SET`status_req`=? WHERE requests.id=?',[req.body.status,req.body.id_request], function (error, results, fields) {
              if (error) throw error;
              console.log("i am in delete");
              res.status(200).send(results)
              console.log("ok done")
          
          
           }) });})








//**********************************************************************************/
app.post("/info_product",(req,res)=>{


  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query('SELECT * FROM offers,products,users WHERE offers.id_offer=? AND offers.id_product=products.id_product AND offers.id_farmer=users.id_user ',[req.body.id_offer ] ,function (error, results1, fields) {
    if (error) throw error;
      
con.query('SELECT id_rate FROM rates WHERE rates.id_user=? AND rates.id_offer=?',[req.body.id_user,req.body.id_offer ] ,function (error, results3, fields) {
  
  con.query('SELECT id_user FROM favorates WHERE favorates.id_user=? AND favorates.id_offer=?',[req.body.id_user,req.body.id_offer ] ,function (error, results4, fields) {
    con.query('SELECT id FROM requests WHERE requests.id_user=?  AND requests.id_offer=? AND status_req="تم ارسال طلبك بنجاح"',[req.body.id_user,req.body.id_offer ] ,function (error, results2, fields) {
        
   
  if (error) throw error;
    console.log(results1,results3,results2);
   
   
    res.status(200).send({
      results1,is_rated:results3.length==0?"new rate":"already rate",is_favorate:results4.length==0?false:true,feed:results2.length==0?"ther_is_feed":"no_feed"
    })
    console.log("ok done")
   
   
    })
 
    
  });
  
 

  });


  });
  

  


 



})











   

})






//************************************************************************************************************************************************************************************************************ */
app.post("/list_of_product_search",(req,res)=>{
console.log("hello in this screen")
console.log(req.body)

 
if(req.body.id=="all"){
let first_arg=" ";let second_arg=" ";
if(req.body.wilaya!=""){
  
first_arg="AND users.province=\""+req.body.wilaya+"\" "
}
if(req.body.max_price!=""){
  second_arg="AND offers.price < "+req.body.max_price+" "

}




  const   query ='SELECT * FROM offers,products,users WHERE users.id_user=offers.id_farmer AND offers.id_product=products.id_product AND products.key_words LIKE ? '+first_arg+' '+""+second_arg
  
 



 
console.log(req.body)
   con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(query, ["%"+req.body.name+"%"] ,function (error, results, fields) {
    if (error) throw error;
     res.status(200).send(results)
    console.log("ok done")


  });
})

  
}else{


  const   query ='SELECT * FROM offers,products WHERE id_farmer=? AND offers.id_product=products.id_product AND products.key_words LIKE ?'
 



 
console.log(req.body)
   con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(query, [req.body.id,"%"+req.body.name+"%"] ,function (error, results, fields) {
    if (error) throw error;
     res.status(200).send(results)
    console.log("ok done")


  });
})


}


 











   

})



//************************************************************************************************************************************************************************************************************ */
app.post("/list_of_favorate_search",(req,res)=>{
  console.log("hello in this screen")
  console.log(req.body)
  
  
  
  
    const   query ='SELECT * FROM favorates,products,offers WHERE favorates.id_user=? AND favorates.id_offer=offers.id_offer  AND offers.id_product=products.id_product AND products.key_words LIKE ?'
   
  
  
  
   
  console.log(req.body)
     con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query(query, [req.body.id_user,"%"+req.body.name+"%"] ,function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.status(200).send(results)
      console.log("ok done")
  
  
    });
  })
  
  
  
  
  
   
  
  
  
  
  
  
  
  
  
  
  
     
  
  })
  
  
  
  























app.post("/list_of_product",(req,res)=>{
  console.log("hjgjghjg",req.body.id)
   if(req.body.id=="all"){


    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query('SELECT * FROM  users,offers,products WHERE offers.id_product=products.id_product AND users.id_user=offers.id_farmer'  ,function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.status(200).send(results)
      console.log("ok done")
  
  
    });
  })
  }
  else{


    con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      con.query('SELECT * FROM offers,products WHERE id_farmer=? AND offers.id_product=products.id_product',[req.body.id] ,function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.status(200).send(results)
      console.log("ok done")
  
  
    });
  })


  }
  
  
  
  
  
  
  
  
  
  
  
  
     
  
  })











app.post("/add_product",(req,res)=>{
  console.log("FDSAFDSfa")
  const farmer_id = req.body.farmer_id;
  
  const name=req.body.name;
  const price=req.body.price;
  const quantity = req.body.quantity;
  const discription = req.body.discription;
  const urls =req.body.urls;
  const date = req.body.date;
  const time = req.body.time;
  const id_Product = req.body.Product_id;
console.log(farmer_id,price,quantity,discription,urls,name)




con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query('INSERT INTO `offers`( `price`, `quantity`,  `discription`, `id_farmer`, `id_product`, `photos`,`date`,`time`) VALUES (?,?,?,?,?,?,?,?)', [price,quantity,discription,farmer_id,name,urls,date,time],function (error, results, fields) {
  if (error) {
    res.status(400).send({
      status:-1
    })
return
  }
  console.log("all think is ok");
  res.status(200).send({
    status:1
    
  })
 
 

});
})












   

})
 
 
 
 

module.exports = app;
