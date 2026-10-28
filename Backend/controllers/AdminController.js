import upload from "../middlewares/multer.js";
import bycrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/DoctorModel.js";
import jwt from "jsonwebtoken";
//Api for adding Doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      fees,
      about,
      experience,
      address,
    } = req.body;
    const imageFile = req.file;
    //checking for all data to add doctor
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !fees ||
      !about ||
      !experience ||
      !address
    ) {
      return res.json({ sucess: false, message: "Missing Details!" });
    }
    //Validating email format
    if (validator.isEmail(email)) {
      res.json({ success: false, message: "Please enter a valid email" });
    }
    // Validating strong password
    if (password.length < 8) {
      return res.json({
        sucess: false,
        message: "Please enter a strong password",
      });
    }

    //hashing doctor password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    //Upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();
    res.json({ success: true, message: "Doctor Added succcessfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Api for the admin login

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// APi to get all doctors list for Admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find().select("-password -__v").lean();
    res.status(200).json({ success: true, doctors });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const doc = await doctorModel.findById(docId);
    if (!doc) return res.status(404).json({ success: false, message: "Doctor not found" });
    await doctorModel.findByIdAndUpdate(docId, { available: !doc.available });
    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export { addDoctor, loginAdmin,allDoctors,changeAvailability };
