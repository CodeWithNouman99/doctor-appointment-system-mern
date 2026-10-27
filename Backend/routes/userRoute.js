import express from "express"
import { registerUser,loginUser,getProfile } from "../controllers/UserController.js"
import authUser from "../middlewares/authUser.js"
const userRouter=express.Router()

// Public routes (no token needed)
userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)

// Protected route: authUser checks the token first, then getProfile runs
userRouter.get("/get-profile",authUser,getProfile)


export default userRouter
