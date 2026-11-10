import express from "express"
import { addDoctor,adminLogin,getAllDoctors } from "../controllers/adminController.js"
import upload from "../middlewares/multer.js"
import authAdmin from "../middlewares/authAdmin.js"


const adminRouter=express.Router()

adminRouter.post("/addDoctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", adminLogin);
adminRouter.get("/getAllDoctors", authAdmin, getAllDoctors);
export default adminRouter;