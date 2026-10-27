import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    image: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: {
      type: Object,
      default: { line1: "", line2: "" },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Not Selected"],
      default: "Not Selected",
    },
    dob: { type: String, default: "Not Selected" },
  },
  { timestamps: true, minimize: false },
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
