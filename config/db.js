const mongoose = require("mongoose")
require("dotenv").config()


const db=async()=>{

    try{
   const db_connection= await mongoose.connect(process.env.MONGO_URL)

   if(db_connection){
    console.log("Db_Connected Successfully!")
   }else{
    console.log("Db_Connection Error!")
   }
  

    }catch(err){
        console.log("The Error",err)

    }
}

module.exports=db