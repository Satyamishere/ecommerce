import mongoose,{Schema} from "mongoose";

const paymentSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  orderId: {
    type: String,
  },
  paymentId: {
    type: String,
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["paid", "failed"],
    default: "paid",
  },
  paidAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true // 
});
export const Payment=mongoose.model("payments",paymentSchema)
