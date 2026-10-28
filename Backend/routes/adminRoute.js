import express from "express"
import { addDoctor,allDoctors,loginAdmin,changeAvailability } from "../controllers/AdminController.js"
import upload from "../middlewares/multer.js"
import authAdmin from "../middlewares/authAdmin.js"
const adminRouter=express.Router()

adminRouter.post("/add-doctor",authAdmin,upload.single("image"),addDoctor)
adminRouter.post("/login",loginAdmin)
adminRouter.get("/all-doctors",authAdmin,allDoctors)
adminRouter.post("/change-availability",authAdmin,changeAvailability)


export default adminRouter