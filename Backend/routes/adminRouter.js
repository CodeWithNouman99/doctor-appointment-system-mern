import express from "express"
import { addDoctor,adminLogin,getAllDoctors } from "../controllers/adminController.js"
import {changeAvailability} from "../controllers/doctorController.js"
import upload from "../middlewares/multer.js"
import authAdmin from "../middlewares/authAdmin.js"

const adminRouter=express.Router()

adminRouter.post("/addDoctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", adminLogin);
adminRouter.get("/getAllDoctors", authAdmin, getAllDoctors);
adminRouter.put("/changeAvailability", authAdmin, changeAvailability);

export default adminRouter;