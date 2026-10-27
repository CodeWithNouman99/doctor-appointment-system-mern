import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDb from "./config/db.js"
import connectCloudinary from "./config/cloudinary.js"
import adminRouter from "./routes/adminRoute.js"
import userRouter from "./routes/userRoute.js"


// App config
const app=express()
const port=process.env.PORT || 4000
connectDb()
connectCloudinary()

// Middlewares
app.use(express.json())
app.use(cors())

//Api endpoint

app.use("/api/admin",adminRouter)
//localhost:4000/api/admin/add-doctor
app.use("/api/user",userRouter)
//localhost:4000/api/user/register


app.get("/",(req,res)=>
{
    res.send("Api is working")
})

app.listen(port,()=>
{
    console.log("Server started",port)
})