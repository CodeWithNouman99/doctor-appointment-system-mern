import express from "express";
import {registerUser,loginUser,getUserProfile} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authUser, getUserProfile);
router.put("/profile", authUser, updateUserProfile);
export default router;