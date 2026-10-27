import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import userModel from "../models/userModel.js";

// Helper: create a login token that stores the user's id and expires in 7 days
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// API to register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Checking that all fields are sent
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details!" });
    }

    // Validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validating strong password (at least 8 characters)
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Checking if a user with this email already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hashing the password so we never save the real password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Saving the new user in the database
    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    // Creating a token so the user is logged in right after registering
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to login a user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking that both fields are sent
    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    // Finding the user. Password has select:false in the model,
    // so we ask for it with "+password" to be able to compare it
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // Comparing the typed password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Password is correct, so we send a token
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get the logged-in user's profile
const getProfile = async (req, res) => {
  try {
    // req.userId was added by the authUser middleware
    // Password is hidden automatically because of select:false in the model
    const userData = await userModel.findById(req.userId).select("-__v");
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, getProfile };
