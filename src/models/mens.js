const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

                         // blockpost
           const empolyregisterSchema =  new mongoose.Schema({
                     firstname:{
                        type:String,
                        required:true,
                        unique:true,
                    },
                    lastname:{
                        type:String,
                        required:true,
                        unique:true,
                    },
                    phonenumber:{
                        type:Number,
                        required:true,
                        unique:true,
                    },
                    gender:{
                        type:String,
                        required:true,
                    },
                    age:{
                        type:String,
                        // required:true,
                    },
                    email:{
                        type:String,
                        required:true,
                        unique:true,
                        validator(value){
                            if(validator.isEmail(value)){
                                throw new Error("Invaild Email")
                            }
                        }
                    },
                    password:{
                        type:String,
                        required:true,
                        unique:true,
                    },
                    confirmpassword:{
                        type:String,
                        required:true,
                        unique:true,
                    },
                    tokens:[{
                        token:{
                            type:String,
                            required:true,
                        }
                    }]
             });

                          // token genarationcreate
         empolyregisterSchema.methods.generateAuthToken = async function(){
                       try{
                           console.log(this._id);
                const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY); 
             this.tokens = this.tokens.concat({token:token});
             await this.save();
             return token ;
                       }catch(error){
                           res.send("the error part" + error);
                           console.log("the error part" + error);
                       }
                          }




            //    password create databash (noSQL)
  empolyregisterSchema.pre("save",async function(next){
      if(this.isModified('password')){
        // console.log(`the current password is ${this.password}`);
        this.password =await bcrypt.hash(this.password,10);
        // console.log(`the current password is ${this.password}`);

                 this.confirmpassword=await bcrypt.hash(this.password,10);
                }
                 next();  
  })




                      //  we will create a new collection
 const register = mongoose.model('register',empolyregisterSchema);


                      // this page other page handeling helping 
 module.exports = register;