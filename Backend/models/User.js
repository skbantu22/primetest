// 🔹 Mongoose Models
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  { name: String, number: String, address: String },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);



export default User
  
