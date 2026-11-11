import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js"
// Api to register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validator.isLength(password, { min: 6 })) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const newData = {
      name,
      email,
      password: hashedPassword,
    };

    // Assuming you have a User model to save the user
    const newUser = await userModel.create(newData);
    const user = await newUser.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Api for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Api to get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming you have middleware to authenticate and set req.user
    const user = await userModel.findById(userId).select("-password"); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User profile retrieved successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user profile", error: error.message });
  }
};

// Api to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender) {
      return res.json({
        success: false,
        message: "Data missing!",
      });
    }
    await userModel.findByIdAndUpdate(userId, {
      name: name,
      phone: phone,
      address: address,
      dob: dob,
      gender: gender,
    });
    if (imageFile) {
      //upload image to cloudinary
      const imageupload = await cloudinary.uploader.upload(imageFile.path, {
        folder: "profile",
      });
      await userModel.findByIdAndUpdate(userId, {
        profile: imageupload.secure_url,
      });
    }
    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err.message,
    });
  }
};


//Api to book appointment
const bookAppointment=async(req,res)=>
{
  try{
    const {userId,docId,slotDate,slotTime}=req.body
    const docData=await doctorModel.findById(docId).select("-password")
    if(!docData.available)
    {
      return res.josn({success:false,message:"Doctor not available"})
    }
    let slotsBooked=docData.slots_Booked

    //checking for slot availability
    if(slotsBooked[slotDate])
    {
      if(slotsBooked[slotDate].includes(slotTime)){
        return res.josn({success:false,message:"Slot not available"})
      }else
    {
      slotsBooked[slotDate].push(slotTime)
    }
    }else
    {
      slotsBooked[slotDate]=[]
      slotsBooked[slotDate].push(slotTime)
    }

    const userData=await userModel.findById(userId).select("-password")
    delete docData.slotsBooked

    const appointmentData={
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotTime,
      slotDate,
      date:Date.now()

    }

    const newAppointment=new appointmentModel(appointmentData)
    await newAppointment.save()

    //save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId,{slotsBooked:slotsBooked})
    res.json({success:true,message:"Appointment booked successfully"})


  }catch (err) {
    console.log(err);
}
}
export { registerUser, loginUser, getUserProfile, updateProfile,bookAppointment }
