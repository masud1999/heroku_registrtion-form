const jwt = require('jsonwebtoken');
const register =require("../models/mens");

const auth = async(req,res,next)=>{
    try{
       const token = req.cookies.jwt;
       const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
       console.log(verifyUser);     

      const user =await register.findOne({_id:verifyUser._id}); 
      console.log(user);

              //   this is logout ke liyea use karna hai
       req.token=token,
       req.user= user , 
            
        next();


    }catch(err){
        res.status(401).send(err);
    }
}



module.exports = auth;