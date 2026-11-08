
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import connectCloudinary from "./config/Cloudinary.js";

dotenv.config();

const app = express();
connectDB();
connectCloudinary()
// Middlewares
app.use(express.json());
app.use(cors());

// Test API
app.get("/", (req, res) => {
  res.send("Doctor Appointment API is running!");
});

// Server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
