const mongoose = require("mongoose");


mongoose.connect('mongodb://localhost:27017/PractisWeb',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(()=>{
    console.log("connection successful");
}).catch(()=>{
    console.log("No Connection");
});