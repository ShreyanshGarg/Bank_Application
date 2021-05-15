   const express = require("express");
   const bodyParser = require("body-parser");
   const ejs = require("ejs");
   const mongoose = require("mongoose");
  let alert = require('alert');


   const app = express();

   app.set('view engine', 'ejs');

   app.use(bodyParser.urlencoded({extended: true}));
   app.use(express.static("public"));

   mongoose.connect('mongodb://localhost:27017/bankDb', {useNewUrlParser: true, useUnifiedTopology: true});

  const bankSchema = {
    name:String,
    mobile:Number,
    mail:String,
    ifsc:String,
    accountno:Number,
    amount:Number
  }

  const transferSchema = {
    sendername:String,
    send_acc:Number,
    recivername:String,
    rec_acc:Number,
    amount:Number
  }

  const Bank = new mongoose.model("Data",bankSchema);
  const Transfer = new mongoose.model("Transfer",transferSchema);

const transfer1 = new Transfer({
  sendername:"ShreyanshGarg",
  send_acc:2000824,
  recivername:"MukeshGupta",
  rec_acc:2000826,
  amount:3690
})

Transfer.find({},function(err,result){
if(result.length ===0)
transfer1.save();

})


const info1 = new Bank({
  name:"Shreyansh Garg",
  mobile:9589663210,
  mail:"gpshre22@gmail.com",
  ifsc:"IABC2563",
  accountno:2000824,
  amount:600000
});
const info2 = new Bank({
  name:"Sarthak Garg",
  mobile:9589663211,
  mail:"gpsart22@gmail.com",
  ifsc:"IABC2589",
  accountno:2000825,
  amount:60000
});
const info3 = new Bank({
  name:"Tanmay Jain",
  mobile:9589663212,
  mail:"gpshre22@gmail.com",
  ifsc:"IABC2567",
  accountno:2000846,
  amount:550000
});

const info4 = new Bank({
  name:"Mukesh Gupta",
  mobile:9589663213,
  mail:"mgcomp2@gmail.com",
  ifsc:"IABC2568",
  accountno:2000826,
  amount:6000000
});
const info5 = new Bank({
  name:"Teena Gupta",
  mobile:9589663214,
  mail:"tggupta@gmail.com",
  ifsc:"IABC2525",
  accountno:2000827,
  amount:600280
});
const info6 = new Bank({
  name:"Tanmay Sharma",
  mobile:9589663215,
  mail:"sharma.tan@gmail.com",
  ifsc:"IABC2532",
  accountno:2000828,
  amount:700000
});
const info7 = new Bank({
  name:"Sneha Sharma",
  mobile:9589663216,
  mail:"sssneha22@gmail.com",
  ifsc:"IABC2523",
  accountno:2000829,
  amount:300000
});
const info8 = new Bank({
  name:"Anjali Arora",
  mobile:9589663217,
  mail:"arora@gmail.com",
  ifsc:"IABC2500",
  accountno:2000830,
  amount:580000
});
  const defaultList = [info1,info2,info3,info4,info5,info6,info7,info8];

  Bank.find({},function(err,result){
    if(result.length ===0){
      Bank.insertMany(defaultList,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Success");
        }
      })
    }
  })


   app.get("/",function(req,res){
     res.render("home");
   })

   app.post("/",function(req,res){
     console.log(req.body.ac_number);
     console.log(req.body.ac_name);
     Bank.find({},function(err,result){
if(err){console.log(err)};

       result.forEach((item) => {
         if(item.accountno === req.body.ac_number*1){
           if(item.name ===req.body.ac_name){
             res.render("balance.ejs",{name:item.name,account:item.accountno,bal:item.amount,error:""});
           }else{
             res.render("balance.ejs",{name:"Error",account:"Error",bal:"N/A",error:"You Entered Wrong Account Number OR Name"});

           }
         }
       });

     })

   })

app.get("/transfer",function(req,res){
  Bank.find({},function(err,result){
    res.render("transac",{list:result});
  })

})

// app.get("fail",function(req,res){
//   res.render("failed_transac");
// })

app.post("/transfer",function(req,res){


 if(req.body.venue[0] === req.body.venue[1]){
   res.render("failed_transac",{EJS:"Sender Reciver Name Same"})
 }
if(req.body.venue[0]==="none" || req.body.venue[1]==="none"){
  res.render("failed_transac",{EJS:"Null Value Encountered"})
}

const reciver = req.body.venue[0];
const sender = req.body.venue[1];
var am1=0,am2=0,acc1=0,acc2=0;
var id1="",id2="";

Bank.find({},function(err,result){
result.forEach((item) => {
  if(item.name === sender){
    if(item.amount<req.body.amount){
      res.render("failed_transac",{EJS:"Insufficient Funds"})
    }
    else{
      am1=item.amount;
      id1=item.id;
      acc1=item.accountno;

    }

  }
  if(item.name ===reciver){
    am2=item.amount;
    id2=item.id;
    acc2=item.accountno;

  }

});
// console.log(am2);

am1 =am1-req.body.amount;
am2 =am2*1 + req.body.amount*1;


// console.log(am2);

Bank.updateOne({_id:id1},{amount:am1},function(err){
if(err){
  console.log(err);
} else{
  console.log("Success");
}
})

Bank.updateOne({_id:id2},{amount:am2},function(err){
if(err){
  console.log(err);
} else{
  console.log("Success");
}
})
const transfer2 = new Transfer({
  sendername:sender,
  send_acc:acc1,
  recivername:reciver,
  rec_acc:acc2,
  amount:req.body.amount
})


transfer2.save();
})


res.render("success_transac",{EJS:"Transaction Succeful"})


// console.log(req.body);
//   console.log(req.body.amount);
})


app.get("/prev_transac",function(req,res){
  Transfer.find({},function(err,result){
    res.render("previous_transac",{list:result});
  })
})




app.get("/all",function(req,res){
  Bank.find({},function(err,result){
if(err){
  console.log(err);
}else
{    res.render("all",{list:result});}

  })


});

app.post("/all",function(req,res){
  console.log(req.body.button);
Bank.find({},function(err,result){

result.forEach((item) => {
  if(req.body.button ===item.name){
    res.render("info.ejs",{name:item.name,account:item.accountno,mobile:item.mobile,mail:item.mail,ifsc:item.ifsc,bal:item.amount});

  }
});

})

})

   app.listen(3000, function() {
     console.log("Server started on port 3000");
   });
