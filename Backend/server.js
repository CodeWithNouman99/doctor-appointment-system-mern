import express from "express"
import cors from "cors"
import "dotenv/config"



// App config
const app=express()
const port=process.env.PORT || 4000


// Middlewares
app.use(express.json())
app.use(cors())

//Api endpoint

app.get("/",(req,res)=>
{
    res.send("Api is working")
})

app.listen(port,()=>
{
    console.log("Server started",port)
})