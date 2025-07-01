import mongoose, { Schema } from "mongoose";
import { User } from "./user.js";
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  price: {
    type: Number,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  image: {
    type: String,
    //required:true,
    lowercase: true,
    trim: true,
  },
  //needs updation of this field in rest of code
  status: {
    type: String,
    enum: ["paid", "failed", "pending", "refunded"],
    default: "pending",
    lowercase: true,
    trim: true,
  },
});
export const Product = mongoose.model("product", productSchema);
