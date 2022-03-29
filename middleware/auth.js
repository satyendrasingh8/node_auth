const jwt = require("jsonwebtoken");

const auth = async(req,res,next)=>{
    try{
  const token = req.cookies.jwt;
  const verifyUser = await jwt.verify(token,process.env.SECREAT_KEY);
  next();
    }catch(e){
        res.status(404).send(e);
    }
}

module.exports = auth;