require('dotenv').config(); 
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require("./middleware/auth");
require("./db/conn") ;
const register  = require("./models/mens");



const port = process.env.PORT || 5080;



                              //  middleware
const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");




                           // server connection form submit
   app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

 
      

app.set('view engine', 'hbs');
app.use(express.static(static_path));
app.set("views",template_path);
hbs.registerPartials(partials_path);


// console.log(process.env.SECRET_KEY);

app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/secret",auth,(req,res)=>{
         // console.log(`this is the cookies awesome ${req.cookies.jwt}`);
    res.render("secret");
})



app.get("/logout",auth,async(req,res)=>{
    try{
      console.log(req.user);
                   // filter id
                //    individual logout item
          req.user.tokens = req.user.tokens.filter((currElement)=>{
              return currElement.token !== req.token
          })

             // all devise logout one click or ging out
    //    req.user.tokens =[];

            res.clearCookie("jwt");

         console.log("logout successfull");
    await req.user.save();
     res.render("login");    
    }catch(error){
        res.status(500).send(error);
    }
})






app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/registration",(req,res)=>{
    res.render("registration");
})


app.get("*",(req,res)=>{
    res.render("404",{
        errorcoments : " Opps page couldnt  be found",
    });
})




          // create a new user in a database

       app.post("/registration", async(req,res)=>{
              try{
                //   console.log(req.body.firstname);
                //    res.send(req.body.firstname);                                   
                const password = req.body.password;
                const cpassword = req.body.confirmpassword;
      if(password === cpassword){
          const empolyregisterSchema = new register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            phonenumber:req.body.phonenumber,
            email:req.body.email,
            gender:req.body.gender,
            age:req.body.age,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword,
          })
          
                      // token generetion
          console.log("the success part" + empolyregisterSchema);
          const token =await empolyregisterSchema.generateAuthToken();
            console.log("the token part" + token);

                   // token ko registration fil karna
           res.cookie("jwt",token ,{
            expires:new Date(Date.now() + 30000),
               httpOnly:true
           })
          console.log(cookie);


            const registers = await empolyregisterSchema.save();
            //   only this line token
            console.log("the page part" + registers);

          res.status(201).render("index");
           }else{
             res.send("password are not match");
          }
             }catch(err){
                res.status(400).send(err); 
                       }
            });



                               // create login form
            app.post("/login",async(req,res)=>{
         try{
          const email = req.body.email;
          const password = req.body.password;
      const userData  = await register.findOne({email:email});

           //    log in check
      
        const isMatch = await bcrypt.compare(password,userData.password);


        // login form tokn create  and check
        const token =await userData.generateAuthToken();
        console.log("the token part" + token);

        //  token ko lo fil karnagin keise kare
        res.cookie("jwt",token ,{
            expires:new Date(Date.now() + 600000),
               httpOnly:true
           })


    //   user password aur body password same thne new page render page enter
          if(isMatch){
              res.status(201).render("index");
          }else{
              res.send("invalid login Details"); 
          }
         }catch(error){
             res.status(400).send("invalid password Details")
         }
            })






app.listen(port,()=>{
    console.log(`connection is set up ${port}`)
});