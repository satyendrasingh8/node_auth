const express = require('express');
const path = require("path");
const bcrypt = require("bcryptjs");
const hbs = require('hbs');
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth")
require("dotenv").config()
require('./db/conn');
const Register = require('./models/registers');
const { use } = require('express/lib/application');
const app = express();
const port  = process.env.PORT || 8000;

//app.use(express.static(path.join(__dirname,'./public')))
const template_path = path.join(__dirname,'./templates/views');
const partials_path = path.join(__dirname,'./templates/partials');
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path)

// must include below middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())

app.get('/',(req,res)=>{
    res.render("index")
})
app.get('/register',(req,res)=>{
    res.render("register")
})
app.get('/login',(req,res)=>{
    res.render("login")
})
app.get('/secreat',auth,(req,res)=>{
   
    res.render("secreat")
})

app.post('/register',async(req,res)=>{

   try{
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    
    if(password==confirmPassword){
  const registerEmployee = Register({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.phone,
      age: req.body.age,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
  });
const token = await registerEmployee.generateAuthToken(); // call instance methods
  res.cookie("jwt",token,{expires:new Date(Date.now() + 30000), httpOnly:true});
 

  const registered = await registerEmployee.save()
  res.status(201).render("index");
    }else{
        res.send("password not match")
    }
   }catch(e){
 res.status(400).send(e);
   }
})


app.post('/login',async(req,res)=>{

    try{
     const password = req.body.password;
     const email = req.body.email;
     const user = await Register.findOne({email:email});
     const token = await user.generateAuthToken(); 
     console.log("token part",token)
     res.cookie("jwt",token,{expires:new Date(Date.now() + 30000), httpOnly:true});

     const isMatch = await bcrypt.compare(password,user.password);
     if(isMatch){
         res.status(201).render("index");
     } else{
         res.send("invalid login details");
     }
     
   
    }catch(e){
  res.status(400).send(e);
    }
 })


// hashing

// const bcrypt = require("bcryptjs");


// const securePass = async(pass)=>{
//  const hashpass = await bcrypt.hash(pass,10);
//  console.log(hashpass);

// }

// securePass("saty");


// const jwt = require('jsonwebtoken')

// const createToken = async()=>{
//     const token = await jwt.sign({_id:"6242ab96388d0979166f3942"},"satyendgdhdkhelfjiu76t890jkt6tgbyu6yikbygukn",{expiresIn:"2 seconds"}); // payload and secreat key(signature)
//     console.log(token)
//     const verify = await jwt.verify(token,"satyendgdhdkhelfjiu76t890jkt6tgbyu6yikbygukn")
//     console.log(verify);
// }

// createToken();


app.listen(port,()=>{
    console.log(`server is not connnected on port  ${port}`)
})