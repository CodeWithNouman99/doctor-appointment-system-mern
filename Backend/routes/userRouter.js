import express from "express";
import {registerUser,loginUser,getUserProfile,updateProfile,bookAppointment,listAppointments,cancelAppointment} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import upload from "../middlewares/multer.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authUser, getUserProfile);
router.post("/update-profile", upload.single("image"), authUser, updateProfile);
router.post("/book-appointment", authUser, bookAppointment);
router.get("/appointments", authUser, listAppointments);
router.post("/cancel-appointment", authUser, cancelAppointment);

export default router;