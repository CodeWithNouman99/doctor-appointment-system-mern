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

export { registerUser };
