import mongoose from "mongoose";

const connectDb = async (req, res) => {
  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`);
};
export default connectDb;
