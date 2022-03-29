const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const res = require('express/lib/response');

const employeeSchema = mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    firstname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]

});

// generate token
employeeSchema.methods.generateAuthToken = async function(){
try{
    const token = jwt.sign({_id:this._id.toString()},process.env.SECREAT_KEY);
    console.log(token);
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;
}catch(e){
res.status(400).send("the error part ",e);
console.log("the error part ",e);
}
}


employeeSchema.pre("save", async function(next) {
   if(this.isModified("password")){
       console.log(`passowrd before ${this.password}`)
    this.password = await bcrypt.hash(this.password,10);
    console.log(`passowrd before ${this.password}`)
    this.confirmPassword = await bcrypt.hash(this.password,10);
   }
   next();
})
// create collection

const Register = mongoose.model('Register',employeeSchema);

module.exports = Register;