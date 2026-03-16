const express=require("express")
const app=express()
const mongoose=require("mongoose")
const cors=require("cors")
const cookieParser = require("cookie-parser");
const db=require("./config/db")
const userRoutes=require("./routes/userRoutes")

require("dotenv").config()
const port=process.env.PORT || 2000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());



app.use("/api/user", userRoutes);


// db_connection

db()


app.listen(port,()=>console.log(`Server is Running on ${port}`))