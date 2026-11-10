import validator from "validator";
import cloudinary from "../config/cloudinary.js";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;

    const imageFile = req.file;

    // Check required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const imageUrl = imageUpload.secure_url;

    // Create doctor object
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

    res.json({
      success: true,
      message: "Doctor Added Successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Authentication system start here
// Api for admin login

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body; 
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
     const token = jwt.sign({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.json({
        success: true,
        message: "Admin login successful",
        token
      });
    } else {
      res.json({
        success: false,
        message: "Invalid email or password",
      });
    }
  }catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// Api to get all doctors
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");     
    res.json({
      success: true,
      doctors,
    });
    console.log("Database:", mongoose.connection.name);
console.log("Doctors:", doctors.length);
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { addDoctor, adminLogin, getAllDoctors };